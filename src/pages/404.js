import React from "react"
import { Link } from 'gatsby';

import Layout from '../Layout';
import Markdown from '../Markdown';

const content = `
# 404 Page Not Found

No page could be found at this URL.  Please choose another from the menu.
`;

const page = () => (
  <Layout>
    <Markdown source={content}/>
  </Layout>
);
export default page;
