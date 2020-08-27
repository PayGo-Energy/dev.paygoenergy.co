import React from "react"

import Layout from '../Layout';
import Markdown from '../Markdown';

import jobAd from '../job-ad';
import noJobOpenings from '../no-job-openings.md';

const gotJobs = false;

export default function Jobs() {
  return (
    <Layout title="Software Jobs">
      {gotJobs && <Markdown source={jobAd}/>}
      {gotJobs || <Markdown source={noJobOpenings}/>}
    </Layout>
  );
}
