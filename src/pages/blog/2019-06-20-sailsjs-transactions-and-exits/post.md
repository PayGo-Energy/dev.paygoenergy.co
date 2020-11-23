[Sails.js Transaction Behaviour](/blog/2019-06-20-sailsjs-transactions-and-exits)
=============================

Sails.js [supports transactions](https://sailsjs.com/documentation/reference/waterline-orm/datastores/transaction) when using the [`sails-postgresql`](https://github.com/balderdashy/sails-postgresql) and [`sails-mysql`](https://github.com/balderdashy/sails-mysql) datastore adapters.

I only have experience with `sails-postgresql`, so unless otherwise mentioned, code below is in reference to that.

At [PayGo](https://dev.paygoenergy.co) we've had a few surprises about how sails transactions act from within controllers.  In hindsight some of these are obvious, but others are a little more subtle.

Also note that there are currently some serious bugs with the sails transaction API, so be careful how you use them:

* [`.transaction()` doesn't guarantee use of a transaction](https://github.com/balderdashy/sails/issues/7068)
* [`.transaction()` doesn't always complete](https://github.com/balderdashy/sails/issues/6805)

# Rule: updating a row locks it until the transaction completes

If you have two competing transactions updating the same row, one will be blocked until the other has completed.

## Example

You have a simple model:

```
// api/models/Thing.js
module.exports = {
  attributes: {
    ...
    lastUpdatedBy: { type:'string' },
    ...
  },
};
```

And two controllers:

```
// api/controllers/quick.js
module.exports = {
  fn: async function(inputs, exits) {
    await sails
        .getDatastore()
        .transaction(async db => {
          await Thing
              .update(1)
              .set({ lastUpdatedBy:'quick' });
        });
  },
};
```
```
// api/controllers/slow.js
module.exports = {
  fn: async function(inputs, exits) {
    await sails
        .getDatastore()
        .transaction(async db => {
          await Thing
              .update(1)
              .set({ lastUpdatedBy:'slow' });
          await sleep(10000);
        });
  },
};

const sleep = millis => new Promise(resolve => setTimeout(resolve, millis));
```
If you now call:

```
time curl http://localhost:1337/slow &
sleep 1 && time curl http://localhost:1337/quick
```

You will see that the call to `/quick` waits until the call to `/slow` has completed before it returns.

# Rule: never update a row without locking, unless your update is atomic

Modifying our slow/quick example from above so that the slow controller now sleeps _before_ updating the db, using the standard sails locking strategy:

```
// api/models/Thing.js
module.exports = {
  attributes: {
    ...
    counter: { type:'number', columnType:'integer' },
    ...
  },
};
```
```
// api/controllers/current.js
module.exports = {
  fn: async function() {
    const t = await Thing.findOne(1);
    return exits.success(t.counter);
  },
};
```
```
// api/controllers/quick.js
module.exports = {
  fn: async function(inputs, exits) {
    await sails
        .getDatastore()
        .transaction(async db => {
          const t = await Thing.findOne(1).usingConnection(db);
          await Thing
              .update(t.id)
              .set({ counter:t.counter+10 })
              .usingConnection(db);
        });
  },
};
```
```
// api/controllers/slow.js
module.exports = {
  fn: async function(inputs, exits) {
    await sails
        .getDatastore()
        .transaction(async db => {
          const t = await Thing.findOne(1).usingConnection(db);
          await sleep(10000);
          await Thing
              .update(t.id)
              .set({ counter:t.counter+3 })
              .usingConnection(db);
        });
  },
};

const sleep = millis => new Promise(resolve => setTimeout(resolve, millis));
```

Assuming an initial value for `t.counter` of zero, if you now call:

```
curl http://localhost:1337/current
curl -q http://localhost:1337/slow &
sleep 1
curl -q http://localhost:1337/quick
curl -q http://localhost:1337/current
sleep 10
curl http://localhost:1337/current
```

You will see:

```
0
10
3
```

## Problem

Although both controllers are reading `Thing #1`, incrementing its counter, and writing it within a transaction, their transactions overlap and cause inconsistent values to be written to the database.

Interestingly, in this case there is actually no value to calling `findOne()` within the transaction - the `usingConnection(db)` appears to do nothing.

## Solution 1: single SQL queries

To achieve consistent updates for these rows, one option is to use proper SQL to perform our updates.  The `quick` and `slow` controllers can be rewritten to increment the `counter` column in a single query:

```
// api/controllers/quick.js
module.exports = {
  fn: async function(inputs, exits) {
    await sails
        .getDatastore()
        .sendNativeQuery('UPDATE Thing SET counter=counter+10 WHERE id=$1', [ 1 ]);
  },
};
```
```
// api/controllers/slow.js
module.exports = {
  fn: async function(inputs, exits) {
    await sleep(10000);
    await sails
        .getDatastore()
        .sendNativeQuery('UPDATE Thing SET counter=counter+3 WHERE id=$1', [ 1 ]);
  },
};

const sleep = millis => new Promise(resolve => setTimeout(resolve, millis));
```

## Solution 2: optimistic locking

Optimistic locking is a lock that is only checked at write-time.  If there have been changes to a row between reading and writing, the write operation fails.

Note that if updating more than one row in a single operation, you should still be using transactions.  At this point you are implicitly using both optimistic _and_ pessimistic locking.

### With implicit versioning

Optimistic locking can be achieved by including the full details of the selected object when requesting an update, e.g.:

```
Thing t = await Thing.find(1);
const updatedRowCount = await Thing
    .update(t)
    .set({ some_property:'new-value' });
if(!updatedRowCount) throw new Error('Update failed for Thing #1');
```

### With explicit versioning

Another approach is to manually track your own `version` column on each database model, and check it whenever doing an update:

```
// api/models/Thing.js
module.exports = {
  attributes: {
    ...
    version: { type:'number', columnType:'integer' },
    ...
  },
};
```
```
// api/controllers/quick.js
const optimisticUpdate = require('../../utils/optimistic-update');
module.exports = {
  fn: async function(inputs, exits) {
    await sails
        .getDatastore()
        .transaction(async db => {
          const t = await Thing.findOne(1).usingConnection(db);
          await optimisticUpdate(db, Thing, t, { counter:t.counter+10 });
        });
  },
};
```
```
// api/controllers/slow.js
module.exports = {
  fn: async function(inputs, exits) {
    await sails
        .getDatastore()
        .transaction(async db => {
          const t = await Thing.findOne(1).usingConnection(db);
          await sleep(10000);
          await optimisticUpdate(db, Thing, t, { counter:t.counter+3 });
        });
  },
};
...
```
```
// utils/optimistic-update.js
module.exports = async function(db, Model, e, update) {
  const updated = Model
      .updateOne({ id:e.id, version:e.version })
      .set(update)
      .usingConnection(db);

  if(!updated) throw new Error(`${Model.globalId}#${e.id} has changed version since last read (expected v${e.version})!`);

  return updated;
};
...
```

As above, in this case there is no value to calling `findOne()` within the transaction - the `usingConnection(db)` appears to do nothing.

`optimisticUpdate()` could also be added to each model's API, e.g. in `config/bootstrap.js`:

```
// config/bootstrap.js
module.exports = {
  ...
  Object.values(sails.models).forEach(addOptimisticUpdate);
  ...
};

function addOptimisticUpdate(Model) {
  Model.optimisticUpdate = async (db, e, update) => {
    const updated = await Model
        .updateOne({ id:e.id, version:e.version })
        .set(update)
        .usingConnection(db);

    if(!updated) throw new Error(`${Model.globalId}#${e.id} has changed version since last read (expected v${e.version})!`);

    return updated;
  };
}
```

## Solution 3: pessimistic locking

This option does not require changes to the data model.  It leaves lock handling to PostgreSQL, which is convenient from an application developer's point of view.  However, there may be performance implications relating to keeping database connections open for longer, and transactions can still fail when competing transactions attempt to make concurrent updates to the same database rows.  In the following implementation, it is also more error-prone if you pass complicated criteria to `find()` or `findOne()`, or non-standard mappings between column names and sails `attributes`.  It takes advantage of PostgreSQL's [`SELECT ... FOR UPDATE` syntax](https://www.postgresql.org/docs/9.5/sql-select.html).

```
// api/controllers/quick.js
const findOneForUpdate = require('../../utils/find-one-for-update');

module.exports = {
  fn: async function(inputs, exits) {
    await sails
        .getDatastore()
        .transaction(async db => {
          const t = await findOneForUpdate(db, Thing, 1);
          await Thing
              .update(t.id)
              .set({ counter:t.counter+10 })
              .usingConnection(db);
        });
  },
};
```
```
// api/controllers/slow.js
const findOneForUpdate = require('../../utils/find-one-for-update');

module.exports = {
  fn: async function(inputs, exits) {
    await sails
        .getDatastore()
        .transaction(async db => {
          const t = await findOneForUpdate(db, Thing, 1);
          await sleep(10000);
          await Thing
              .update(t.id)
              .set({ counter:t.counter+10 })
              .usingConnection(db);
        });
  },
};
...
```
```
// utils/find-one-for-update.js
module.exports = async function(db, Model, id) {
  return sails
      .getDatastore()
      .sendNativeQuery(`SELECT * FROM ${Model.tableName} WHERE id=$1 FOR UPDATE`, [ id ])
      .usingConnection(db);
};
...
```

# Rule: never reference `exits` from within `transaction(...)`

## Example: `exits.success()`

### Bad code 

```
module.exports = {
  fn: async function(inputs, exits) {
    await sails
      .getDatastore()
      .transaction(async db => {
        doSomeTransactionalStuff(db);
        return exits.success();
      });
  },
};
```

### Good code

```
module.exports = {
  fn: async function(inputs, exits) {
    await sails
      .getDatastore()
      .transaction(async db => {
        doSomeTransactionalStuff(db);
      });

    return exits.success();
  },
};
```

### Explanation

When `exits.success()` is called, the HTTP Status code `200` is written to the response stream.  After this has been written, it cannot be changed to an error code.  However, in the first example, `exits.success()` is called _before the transaction has been committed to the database_.  This means that although there were no `Error`s thrown by `doSomeTransactionalStuff()`, there is still a chance that the transaction commit could fail in PostgreSQL.  Some reasons this could fail include:

* violation of a database-level constraint, e.g.uniqueness
* failure/timeout of the db connection

Because `exits.success()` has already been called, there is no way to notify the client that there was a problem committing the transaction.

More insidious, if the transaction _succeeds_, a race condition is introduced: the client may process the 200 response before the database write has completed.  We've seen integration tests fail intermittently because of this.

Therefore, any call to `exits.*()` or `this.res.status(...)` must be made _after_ a transaction has been committed.

If the transaction fails, an `Error` will be thrown.  In the first example, this will provoke sails to report:

```
WARNING: Something seems to be wrong with this function.
It is trying to signal that it has finished AGAIN, after
already resolving/rejecting once.
(silently ignoring this...)
```

In the good code above, the `Error` will be thrown _before_ the call to `exits.success()`, and a `500` error returned to the client.

## Example: `exits.myError()`

### Bad code

```
module.exports = {
  exits: {
    myError: { statusCode:500 },
  },
  fn: async function(inputs, exits) {
    await sails
      .getDatastore()
      .transaction(async db => {
        await Thing
            .update({ some_property:'some_value' })
            .set({ other_property:false });

        const ok = await isSomeConstraintSatisfied(inputs);
        if(!ok) {
          return exits.myError();
        }
      });

    return exits.success();
  },
};
```

### Good code

```
module.exports = {
  exits: {
    myError: { statusCode:500 },
  },
  fn: async function(inputs, exits) {
    try {
      await sails
        .getDatastore()
        .transaction(async db => {
          await Thing
              .update({ some_property:'some_value' })
              .set({ other_property:false });

          const ok = await isSomeConstraintSatisfied(inputs);
          if(!ok) {
            throw new Error();
          }
        });

      return exits.success();
    } catch(e) {
      return exits.myError();
    }
  },
};
```

### Explanation

There are two problems in the bad code above - the `return` within the transaction:

1. actually returns to the parent `fn`, which then continues executing.  Therefore both `exits.myError()` _and_ `exits.success()` are called.
2. allows the transaction to complete cleanly, and therefore `waterline` will attempt to commit it to the database.  This means that, perhaps counterintuitively, if we return `exits.myError()`, the database update to `Thing` will still be committed to the database.

In the second example, if `ok` is `false`, an `Error` is thrown.  This causes the transaction to be rolled back, before finally calling `exits.myError()`, which will return a status `500` to the client.

# Rule: `.intercept()` actually works!

This surprised me, as it looks like it should also suffer from the two-writes bug described above ("`It is trying to signal that it has finished AGAIN`"):

```
module.exports = {
  exits: {
    badly: { statusCode:567 },
  },

  fn: async function(inputs, exits) {
    await sails
      .getDatastore()
      .transaction(async db => {
        await Thing
            .create({ id:1 })
            .intercept('E_UNIQUE', 'badly')
            .usingConnection(db);
      });

    return exits.success();
  },
};
```

As intended, although perhaps not expected, this will return an HTTP status code of `567`, _without_ logging a `WARNING` 🤔

---

# Conclusion

Transactions are important, but complicated.  `exits` are complicated, but perhaps not important.  🤷
