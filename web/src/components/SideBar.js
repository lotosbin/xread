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

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

const SideBar = () => {
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

export default SideBar;