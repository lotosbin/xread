import {createStore} from 'redux'
import todoApp from './reducers'

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
var preloadedState = {
    theme: isDark ? 'dark' : 'light',
    language: 'en'
};
const store = createStore(todoApp, preloadedState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;