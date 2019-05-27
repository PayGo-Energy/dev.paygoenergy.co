import React, { Fragment } from 'react';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

import Header from './Header';
import Markdown from './Markdown';

import './App.css'; // please replace this CSS with proper material-ui-tailored JSS at some point
import jobAd from './job-ad';

function App() {
  return (
    <Fragment>
      <CssBaseline/>
      <Header/>
      <Container maxWidth="lg" className="content-container">
        <Markdown>
          {jobAd}
        </Markdown>
      </Container>
    </Fragment>
  );
}

export default App;
