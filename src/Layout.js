import React, { Fragment } from 'react';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

import Header from './Header';

import './Layout.css'; // please replace this CSS with proper material-ui-tailored JSS at some point

export default function App({ children, title }) {
  return (
    <Fragment>
      <CssBaseline/>
      <Header title={title}/>
      <Container>
        {children}
      </Container>
    </Fragment>
  );
};
