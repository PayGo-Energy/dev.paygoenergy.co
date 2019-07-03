import React from 'react';
import { Link } from 'gatsby';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import SailsIcon from '@material-ui/icons/DirectionsBoat';

import Layout from '../../Layout';

export default function Blog() {
  return (
    <Layout title="Software Blog">
      <List>
        <ListItem button component={Link} to="/blog/2019-06-20-sailsjs-transactions-and-exits">
          <ListItemIcon>
            <SailsIcon/>
          </ListItemIcon>
          <ListItemText>SailsJS transactions and exits</ListItemText>
        </ListItem>
      </List>
    </Layout>
  );
}
