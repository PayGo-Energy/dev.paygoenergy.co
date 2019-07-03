import React from "react"

import Layout from '../Layout';
import Markdown from '../Markdown';

import jobAd from '../job-ad';

export default function Jobs() {
  return (
    <Layout title="Software Jobs">
      <Markdown source={jobAd}/>
    </Layout>
  );
}
