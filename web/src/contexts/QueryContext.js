import * as React from "react";

const QueryContext = React.createContext({
    query: null,
    variables: null,
});
export default QueryContext;