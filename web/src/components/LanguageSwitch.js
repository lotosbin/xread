import React, {useState} from 'react';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";

const LanguageSwitch = () => {
    const {t, ready, i18n} = useTranslation("", {useSuspense: false});
    const [lang, setLang] = useState(i18n.language);
    return <FormControl>
        <Select
            value={lang}
            onChange={event => {
                setLang(event.target.value);
                i18n.changeLanguage(event.target.value);
            }}
            inputProps={{
                name: 'lang',
                id: 'lang-simple',
            }}
        >
            <MenuItem value={'en'}>English</MenuItem>
            <MenuItem value={'zh'}>中文</MenuItem>
        </Select>
    </FormControl>;
};
export default LanguageSwitch;