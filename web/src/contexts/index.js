// @flow
import * as React from "react";


export const ViewModeContext = React.createContext({
    mode: 'rich',
    setMode: (mode: string) => {
    }
});
