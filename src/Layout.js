import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';


import './Layout.css'; // please replace this CSS with proper material-ui-tailored JSS at some point

import MenuIcon from '@material-ui/icons/Menu';

const drawerWidth = 120; // TODO this really shouldn't need to be fixed-width
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    overflow: 'auto',
  },
}));

export default ({ children, title }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Helmet defer={false} title={pageTitle(title)}/>
      <CssBaseline/>

      <AppBar position="fixed" color="default" className={classes.appBar}>
        <Toolbar style={{backgroundColor:'#00254a', color:'white'}}>
          <Link to="/">
            <img alt="PayGo Energy" src="/logo.svg" style={{height:'2em', marginRight:'1em'}}/>
          </Link>
          <Typography variant="h6" color="inherit">
            {title || 'Software'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}>
        <Toolbar/>
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button component={Link} to="/blog">
              <ListItemText>Blog</ListItemText>
            </ListItem>
            <ListItem button component={Link} to="/jobs">
              <ListItemText>Jobs</ListItemText>
            </ListItem>
          </List>
        </div>
      </Drawer>

      <main className={classes.content}>
        <Toolbar/>
        {children}
      </main>
    </div>
  );
};

function pageTitle(title) {
  return title ?
      `${title} | PayGo Energy Dev Team` :
      'PayGo Energy Dev Team';
}
