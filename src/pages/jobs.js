import React from "react"

import Layout from '../Layout';
import Markdown from '../Markdown';

import noJobOpenings from '../no-job-openings.md';

export default function Jobs() {
  return (
    <Layout title="Software Jobs">
      <Markdown source={noJobOpenings}/>
    </Layout>
  );
}
