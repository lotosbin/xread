import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from './SideBar.module.css'

const SideBar = ({location: {search}}) => {
    const {t} = useTranslation("", {useSuspense: false});
    return (
        <div className={styles.root}>
            <List component="nav">
                <ListItem button component={Link} to={`/article/box/inbox`}>
                    <ListItemText primary={t("Inbox")}/>
                </ListItem>
            </List>
            <List component="nav">
                <ListItem button component={Link} to={`/article/box/spam`}>
                    <ListItemText primary={t("Spam")}/>
                </ListItem>
            </List>
            <Divider/>
            <List component="nav">
                <ListItem button component={Link} to={`/article/box/all`}>
                    <ListItemText primary={t("All")}/>
                </ListItem>
            </List>
        </div>
    );
};

export default SideBar;