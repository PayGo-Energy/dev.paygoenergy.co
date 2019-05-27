import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

import Header from './Header';
import Jobs from './Jobs';

import './App.css'; // please replace this CSS with proper material-ui-tailored JSS at some point

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline/>
      <Header/>
      <Container maxWidth="lg" className="content-container">
        <Switch>
          <Route exact path="/jobs/" component={Jobs} />
          <Redirect from="/" to="/jobs/" component={Jobs} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};
