import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';

import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import BlogIcon from '@material-ui/icons/SmsFailed';
import HomeIcon from '@material-ui/icons/Home';
import JobsIcon from '@material-ui/icons/GroupAdd';
import MenuIcon from '@material-ui/icons/Menu';

const drawerWidth = 150; // TODO this really shouldn't need to be fixed-width
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

const MenuItem = ({ linkTo, icon, text}) => {
  const selected = linkTo === '/' ? window.location.pathname === '/' : window.location.pathname.startsWith(linkTo);

  return (
    <ListItem button component={Link} to={linkTo} selected={selected}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText style={{marginRight:20}}>{text}</ListItemText>
    </ListItem>
  );
};

const MenuItems = () => (
  <List>
    <MenuItem linkTo="/"     icon={<HomeIcon/>} text="Home"/>
    <MenuItem linkTo="/blog" icon={<BlogIcon/>} text="Blog"/>
    <MenuItem linkTo="/jobs" icon={<JobsIcon/>} text="Jobs"/>
  </List>
);

const LargerLayout = ({ children, title }) => {
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
          <MenuItems/>
        </div>
      </Drawer>

      <main className={classes.content}>
        <Toolbar/>
        {children}
      </main>
    </div>
  );
};


const smallerStyles = {
  logo: { height:'2em', marginRight:'1em' },
  headerBackground: { backgroundColor:'#00254a', color:'white' },
  grow: { flexGrow:1 },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class SmallerLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.closeDrawer = this.closeDrawer.bind(this);
    this.openDrawer  = this.openDrawer.bind(this);
  }

  closeDrawer() { this.setState({ drawerOpen:false }); }
  openDrawer()  { this.setState({ drawerOpen:true  }); }

  render() {
    const { children, classes, title } = this.props;
    const { drawerOpen } = this.state;

    return (
      <>
        <AppBar position="static" color="default">
          <Toolbar className={classes.headerBackground}>
            <IconButton color="inherit" aria-label="Open drawer" edge="start" onClick={this.openDrawer}>
              <MenuIcon/>
            </IconButton>
            <Link to="/">
              <img alt="PayGo Energy" src="/logo.svg" className={classes.logo}/>
            </Link>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer open={drawerOpen} onClose={this.closeDrawer}>
          <MenuItems/>
        </Drawer>

        <Container>
          {children}
        </Container>
      </>
    );
  }
}

const StyledSmallerLayout = withStyles(smallerStyles)(SmallerLayout);

export default ({ children, title }) => (
  <>
    <Hidden smUp>
      <StyledSmallerLayout title={title}>
        {children}
      </StyledSmallerLayout>
    </Hidden>
    <Hidden xsDown>
      <LargerLayout title={title}>
        {children}
      </LargerLayout>
    </Hidden>
  </>
);

function pageTitle(title) {
  return title ?
      `${title} | PayGo Energy Dev Team` :
      'PayGo Energy Dev Team';
}
