// @flow
import React, {Suspense, useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import CssBaseline from '@material-ui/core/CssBaseline';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import './i18n';
import {ViewModeProvider} from "./contexts";
import store from './redux/store';
import {Provider, useSelector} from 'react-redux'



function MyApp() {
    const theme = useSelector(state => state.theme);
    const uiTheme = createMuiTheme({
        typography: {
            useNextVariants: true,
        },
        palette: {
            type: theme,
        },
    });

    return (

        <MuiThemeProvider theme={uiTheme}>
            <CssBaseline/>
            <ViewModeProvider>
                <App/>
            </ViewModeProvider>
        </MuiThemeProvider>

    );
}

ReactDOM.render(<Provider store={store}><MyApp/></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
