// @flow
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from "react-router-dom";
import styles from "./AppBar.module.css";
import ThemeSwitch from "../containers/ThemeSwitch";
import {useTranslation} from "react-i18next";
import LanguageSwitch from "../containers/LanguageSwitch";

const ButtonAppBar = () => {
    const {t, ready} = useTranslation("", {useSuspense: false});
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton className={styles.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" color="inherit">{t('xRead')}</Typography>
                    <Toolbar className={styles.nav}>
                        <Button className={styles.nav_item} color="inherit" component={Link} to="/article">{t('Home')}</Button>
                        <Button className={styles.nav_item} color="inherit" component={Link} to="/guess/box/inbox">{t('Guess')}</Button>
                        <Button className={styles.nav_item} color="inherit" component={Link} to="/topic">{t('Topic')}</Button>
                        <Button className={styles.nav_item} color="inherit" component={Link} to="/tag">{t('Tag')}</Button>
                        <Button className={styles.nav_item} color="inherit" component={Link} to="/feed">{t('Feed')}</Button>
                        <Button className={styles.nav_item} color="inherit" component={Link} to="/series">{t('Series')}</Button>
                        <Button className={styles.nav_item} color="inherit" component={"a"} href="http://store.xread.yuanjingtech.com" target="_blank">{t('Store')}</Button>
                        <Button className={styles.nav_item} color="inherit" component={"a"} href="http://feathub.com/lotosbin/xread" target="_blank">{t('Advice')}</Button>
                    </Toolbar>
                    <ThemeSwitch/>
                    <LanguageSwitch />
                    <Button color="inherit">{t('Login')}</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default ButtonAppBar;