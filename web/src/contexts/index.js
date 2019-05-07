// @flow
import * as React from "react";
import {useState} from "react";


export const ViewModeContext = React.createContext({
    mode: 'rich',
    setMode: (mode: string) => {
    }
});
export const ViewModeProvider = (props) => {
    const [mode, setMode] = useState(localStorage.getItem('view_mode') || 'rich');
    return <ViewModeContext.Provider value={{
        mode,
        setMode: (mode) => {
            setMode(mode);
            localStorage.setItem('view_mode', mode)
        }
    }}>{props.children}</ViewModeContext.Provider>
};