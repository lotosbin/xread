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
                    <Toolbar className={styles.nav}>
                        <Button className={styles.nav_item} color="inherit" component={Link} to="/article">Home</Button>
                        <Button className={styles.nav_item} color="inherit" component={Link} to="/topic">Topic</Button>
                        <Button className={styles.nav_item} color="inherit" component={Link} to="/tag">Tag</Button>
                        <Button className={styles.nav_item} color="inherit" component={Link} to="/feed">Feed</Button>
                        <Button className={styles.nav_item} color="inherit" component={"a"} href="http://store.xread.yuanjingtech.com" target="_blank">Store</Button>
                        <Button className={styles.nav_item} color="inherit" component={"a"} href="http://feathub.com/lotosbin/xread" target="_blank">功能建议</Button>
                    </Toolbar>
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