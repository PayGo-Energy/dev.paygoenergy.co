import React from "react"
import { Link } from 'gatsby';

import Layout from '../Layout';
import Markdown from '../Markdown';

import home from './home.md';

export default () => (
  <Layout>
    <Markdown source={home}/>
  </Layout>
);
