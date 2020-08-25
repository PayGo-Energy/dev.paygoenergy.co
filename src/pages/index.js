import React from "react"
import { Link } from 'gatsby';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import BlogIcon from '@material-ui/icons/SmsFailed';
import JobsIcon from '@material-ui/icons/GroupAdd';

import Layout from '../Layout';

export default () => (
  <Layout>
    <List>
      <ListItem button component={Link} to="/blog">
        <ListItemIcon>
          <BlogIcon/>
        </ListItemIcon>
        <ListItemText>Blog</ListItemText>
      </ListItem>
      <ListItem button component={Link} to="/jobs">
        <ListItemIcon>
          <JobsIcon/>
        </ListItemIcon>
        <ListItemText>Jobs</ListItemText>
      </ListItem>
    </List>
  </Layout>
);
