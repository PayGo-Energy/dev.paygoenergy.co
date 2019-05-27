import React from 'react';

import Markdown from './Markdown';

import jobAd from './job-ad';

export default function Jobs() {
  return (
    <Markdown>
      {jobAd}
    </Markdown>
  );
}
