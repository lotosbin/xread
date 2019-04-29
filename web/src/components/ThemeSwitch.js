// @flow
import React, {useContext} from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ThemeContext from "../contexts/ThemeContext";
import {useTranslation} from "react-i18next";

const ThemeSwitch = () => {
    const {t, ready, i18n} = useTranslation("", {useSuspense: false});
    const {theme, setTheme} = useContext(ThemeContext);
    return <FormGroup row>
        <FormControlLabel
            control={
                <Switch
                    checked={theme === 'dark'}
                    onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                    value={theme === 'dark'}
                />
            }
            label={t("Dark Mode")}
        />
    </FormGroup>
};
export default ThemeSwitch;