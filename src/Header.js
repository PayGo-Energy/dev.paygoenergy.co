import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <AppBar position="static" color="default">
          <Toolbar className={classes.headerBackground}>
            <Link href="https://www.paygoenergy.co">
              <img src="https://s3.us-east-2.amazonaws.com/paygoenergy/img/icons/logo-menubar.svg" className={classes.logo}/>
            </Link>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Software Engineering Jobs
            </Typography>
          </Toolbar>
        </AppBar>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Header);

