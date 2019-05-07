import queryString from "query-string";
import {useTranslation} from "react-i18next";
import React, {Fragment} from "react";
import Button from "@material-ui/core/Button";
import {Link, withRouter} from "react-router-dom";

const ReadFilters = ({location: {search}}) => {
    let {read = "all"} = queryString.parse(search);
    const {t} = useTranslation("", {useSuspense: false});
    return <Fragment>
        <Button color={read === "all" ? "primary" : "default"} component={Link} to={`?read=all`}>{t('All')}</Button>
        <Button color={read === "unread" ? "primary" : "default"} component={Link} to={`?read=unread`}>{t('Unread Only')}</Button>
        <Button color={read === "readed" ? "primary" : "default"} component={Link} to={`?read=readed`}>{t('Read')}</Button>
    </Fragment>
};
export default withRouter(ReadFilters);