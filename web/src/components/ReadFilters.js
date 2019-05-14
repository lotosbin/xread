import queryString from "query-string";
import {useTranslation} from "react-i18next";
import React, {Fragment} from "react";
import Button from "@material-ui/core/Button";
import {Link, withRouter} from "react-router-dom";

export function query_set(key: string, value: any, search: URLSearchParams) {
    search.set(key, value);
    return search;
}
const ReadFilters = ({location: {search}}) => {
    let {read = "all"} = queryString.parse(search);
    let searchParams = new URLSearchParams(search);
    const {t} = useTranslation("", {useSuspense: false});
    return <Fragment>
        <Button color={read === "all" ? "primary" : "default"} component={Link} to={`?${query_set('read', 'all', searchParams)}`}>{t('All')}</Button>
        <Button color={read === "unread" ? "primary" : "default"} component={Link} to={`?${query_set('read', 'unread', searchParams)}`}>{t('Unread Only')}</Button>
        <Button color={read === "readed" ? "primary" : "default"} component={Link} to={`?${query_set('read', 'readed', searchParams)}`}>{t('Read')}</Button>
    </Fragment>
};
export default withRouter(ReadFilters);