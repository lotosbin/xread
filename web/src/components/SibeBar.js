import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import {Link} from "react-router-dom";

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

function SimpleList(props) {
    const {classes} = props;
    return (
        <div className={classes.root}>
            <List component="nav">
                <Link to={`/article/box/all`}>
                    <ListItem button>
                        <ListItemText primary="All"/>
                    </ListItem>
                </Link>
            </List>
            <Divider/>
            <List component="nav">
                <Link to={`/article/box/inbox`}>
                    <ListItem button>
                        <ListItemIcon>
                            <InboxIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Inbox"/>
                    </ListItem>
                </Link>
            </List>
            <Divider/>
            <List component="nav">
                <Link to={`/article/box/spam`}>
                    <ListItemLink href="#simple-list">
                        <ListItemText primary="Spam"/>
                    </ListItemLink>
                </Link>
            </List>
        </div>
    );
}

SimpleList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleList);