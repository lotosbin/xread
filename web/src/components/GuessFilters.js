import queryString from "query-string";
import {useTranslation} from "react-i18next";
import React, {Fragment} from "react";
import Button from "@material-ui/core/Button";
import {Link, withRouter} from "react-router-dom";
import {query_set} from "../utils";


const GuessFilters = ({location: {search}}) => {
    let {read = "all", priority = "0"} = queryString.parse(search);
    let searchParams = new URLSearchParams(search);
    const {t} = useTranslation("", {useSuspense: false});
    return <Fragment>
        <Button color={priority === "1" ? "primary" : "default"} component={Link} to={`?${query_set('priority', '1', searchParams)}`}>
            {t("Guess Read")}
        </Button>
        <Button color={priority === "0" ? "primary" : "default"} component={Link} to={`?${query_set('priority', '0', searchParams)}`}>
            {t("Guess Normal")}
        </Button>
        <Button color={priority === "-1" ? "primary" : "default"} component={Link} to={`?${query_set('priority', '-1', searchParams)}`}>
            {t("Guess Spam")}
        </Button>
    </Fragment>
};
export default withRouter(GuessFilters);