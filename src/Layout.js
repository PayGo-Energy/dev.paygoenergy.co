import React, { Fragment } from 'react';
import Helmet from 'react-helmet';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

import Header from './Header';

import './Layout.css'; // please replace this CSS with proper material-ui-tailored JSS at some point

export default function App({ children, title }) {
  return (
    <Fragment>
      <Helmet defer={false} title={pageTitle(title)}/>
      <CssBaseline/>
      <Header title={title || 'Software'}/>
      <Container>
        {children}
      </Container>
    </Fragment>
  );
};

function pageTitle(title) {
  return title ?
      `${title} | PayGo Energy Dev Team` :
      'PayGo Energy Dev Team';
}
