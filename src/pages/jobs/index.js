import React from "react"

import Layout from '../../Layout';
import Markdown from '../../Markdown';

import jobAd from './ad.md';
import noJobOpenings from './no-openings.md';

const gotJobs = false;

export default function Jobs() {
  return (
    <Layout title="Software Jobs">
      <Markdown source={gotJobs ? jobAd : noJobOpenings}/>
    </Layout>
  );
}
