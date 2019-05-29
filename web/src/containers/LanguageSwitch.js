import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {toggleLanguage} from "../redux/actions";
import LanguageSwitch from "../components/LanguageSwitch";

const LanguageSwitchContainer = (props) => {

    const {t, ready, i18n} = useTranslation("", {useSuspense: false});
    const lang = useSelector(state => state.language);
    var dispatch = useDispatch();
    return <LanguageSwitch lang={lang} setLang={(lang) => dispatch(toggleLanguage(lang))}/>;
};
export default LanguageSwitchContainer;