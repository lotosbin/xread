import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from './SideBar.module.css'
import {query_set} from "../utils";
const SideBar = ({location: {search}}) => {
    const searchParams = new URLSearchParams(search);
    const {t} = useTranslation("", {useSuspense: false});
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

                <ListItem button component={Link} to={`/article/box/inbox`}>
                    <ListItemIcon>
                        <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary={t("Inbox")}/>
                </ListItem>
                <ListItem button component={Link} to={`/article/box/inbox?${query_set('priority', '1', searchParams)}`}>
                    <ListItemText primary={t("Guess Read")}/>
                </ListItem>
                <ListItem button component={Link} to={`/article/box/inbox?${query_set('priority', '0', searchParams)}`}>
                    <ListItemText primary={t("Guess Normal")}/>
                </ListItem>
                <ListItem button component={Link} to={`/article/box/inbox?${query_set('priority', '-1', searchParams)}`}>
                    <ListItemText primary={t("Guess Spam")}/>
                </ListItem>
            </List>
            <Divider/>
            <List component="nav">

                <ListItem button component={Link} to={`/article/box/spam`}>
                    <ListItemText primary={t("Spam")}/>
                </ListItem>
            </List>
        </div>
    );
};

export default SideBar;