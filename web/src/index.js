// @flow
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import CssBaseline from '@material-ui/core/CssBaseline';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import ThemeContext from "./contexts/ThemeContext";

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
function MyApp() {
    const [theme, setTheme] = useState(isDark ? 'dark' : "light");

    const uiTheme = createMuiTheme({
        palette: {
            type: theme,
        },
    });
    return (
        <React.Fragment>
            <ThemeContext.Provider value={{theme, setTheme}}>
                <MuiThemeProvider theme={uiTheme}>
                    <CssBaseline/>
                <App/>
            </MuiThemeProvider>
            </ThemeContext.Provider>
        </React.Fragment>
    );
}

ReactDOM.render(<MyApp/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
