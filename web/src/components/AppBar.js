import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from "react-router-dom";
import styles from "./AppBar.module.css";
import ThemeSwitch from "./ThemeSwitch";

const _styles = {
    root: {
        flexGrow: 0,
    },
    grow: {
        flexGrow: 0,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};


function ButtonAppBar(props) {
    const {classes} = props;
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" color="inherit" className={classes.grow}>
                        xRead
                    </Typography>
                    <div className={styles.nav}>
                        <div className={styles.nav_item}><Link to="/article">Home</Link></div>
                        <div className={styles.nav_item}><Link to="/topic">Topic</Link></div>
                        <div className={styles.nav_item}><Link to="/tag">Tag</Link></div>
                        <div className={styles.nav_item}><Link to="/feed">Feed</Link></div>
                        <div className={styles.nav_item}><a href="http://store.xread.yuanjingtech.com" target="_blank">Store</a></div>
                    </div>
                    <ThemeSwitch/>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(_styles)(ButtonAppBar);