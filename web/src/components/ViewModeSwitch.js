import React, {useContext, useState} from 'react';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";
import {ViewModeContext} from "../contexts";

const ViewModeSwitch = () => {
    const {t} = useTranslation("", {useSuspense: false});
    const {mode, setMode} = useContext(ViewModeContext);
    return <FormControl>
        <Select
            value={mode}
            onChange={event => {
                setMode(event.target.value);
            }}
            inputProps={{
                name: 'view-mode',
                id: 'view-mode-simple',
            }}
        >
            <MenuItem value={'rich'}>{t('view_mode_rich')}</MenuItem>
            <MenuItem value={'single_line'}>{t('view_mode_single_line')}</MenuItem>
        </Select>
    </FormControl>;
};
export default ViewModeSwitch;