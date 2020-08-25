import React from 'react';

import Layout from '../../../Layout';
import Markdown from '../../../Markdown';

import post from './post.md';

export default () => (
  <Layout title="SailsJS transactions and exits">
    <Markdown source={post}/>
  </Layout>
);
