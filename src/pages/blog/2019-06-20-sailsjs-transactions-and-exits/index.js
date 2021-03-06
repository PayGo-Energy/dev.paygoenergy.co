import React from 'react';

import Layout from '../../../Layout';
import Markdown from '../../../Markdown';

import post from './post.md';

const page = () => (
  <Layout title="SailsJS transactions and exits" description="An introduction to using PostgreSQL database transactions with Sails.js and sails-postgresql.">
    <Markdown source={post}/>
  </Layout>
);
export default page;
