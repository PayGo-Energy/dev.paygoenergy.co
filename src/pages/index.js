import React from "react"
import { Link } from 'gatsby';

import Layout from '../Layout';
import Markdown from '../Markdown';

import home from './home.md';

const page = () => (
  <Layout>
    <Markdown source={home}/>
  </Layout>
);
export default page;
