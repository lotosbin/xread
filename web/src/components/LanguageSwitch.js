import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const LanguageSwitch = (props) => {
    const {lang, setLang} = props;
    return <FormControl>
        <Select
            value={lang}
            onChange={event => setLang(event.target.value)}
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