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
import {useTranslation} from "react-i18next";
import {makeStyles} from '@material-ui/styles';
import styles from './SideBar.module.css'
// const styles = theme => ({
//     root: {
//         width: '100%',
//         maxWidth: 360,
//         backgroundColor: theme.palette.background.paper,
//     },
// });
// const useStyles = makeStyles(styles);

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}
const SideBar = props => {
    const {t, ready} = useTranslation("", {useSuspense: false});
    // const classes = useStyles();
    return (
        <div className={styles.root}>
            <List component="nav">
                <Link to={`/article/box/all`}>
                    <ListItem button>
                        <ListItemText primary={t("All")}/>
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
                        <ListItemText primary={t("Inbox")}/>
                    </ListItem>
                </Link>
            </List>
            <Divider/>
            <List component="nav">
                <Link to={`/article/box/spam`}>
                    <ListItemLink href="#simple-list">
                        <ListItemText primary={t("Spam")}/>
                    </ListItemLink>
                </Link>
            </List>
        </div>
    );
};

SideBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default SideBar;