import React, { Component, Fragment } from 'react';
import { Link } from 'gatsby';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  logo: { height:'2em', marginRight:'1em' },
  headerBackground: { backgroundColor:'#00254a', color:'white' },
  grow: { flexGrow:1 },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.closeDrawer = this.closeDrawer.bind(this);
    this.openDrawer  = this.openDrawer.bind(this);
  }

  closeDrawer() { this.setState({ drawerOpen:false }); }
  openDrawer()  { this.setState({ drawerOpen:true  }); }

  render() {
    const { classes, title } = this.props;
    const { drawerOpen } = this.state;

    return (
      <Fragment>
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
          <List>
            <ListItem button component={Link} onClick={this.closeDrawer} to="/blog">
              <ListItemText>Blog</ListItemText>
            </ListItem>
            <ListItem button component={Link} onClick={this.closeDrawer} to="/jobs">
              <ListItemText>Jobs</ListItemText>
            </ListItem>
          </List>
        </Drawer>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Header);
