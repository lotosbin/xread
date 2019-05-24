export const TOGGLE_THEME = 'TOGGLE_THEME';
export const TOGGLE_LANGUAGE = 'TOGGLE_LANGUAGE';

export const toggleTheme = theme => ({type: TOGGLE_THEME, payload: theme});
export const toggleLanguage = language => ({type: TOGGLE_LANGUAGE, payload: language});
