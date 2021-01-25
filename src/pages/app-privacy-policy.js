import React from "react"
import Helmet from 'react-helmet';
import { Link } from 'gatsby';

import Layout from '../Layout';
import Markdown from '../Markdown';

import privacyPolicy from './app-privacy-policy.md';

const page = () => (
  <Layout>
    <Helmet>
      <meta name="robots" content="noindex"/>
    </Helmet>
    <Markdown source={privacyPolicy}/>
  </Layout>
);
export default page;
