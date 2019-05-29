import React from "react";
import styles from "./ArticleListItem.module.css"
import moment from "moment";
import {Link, withRouter} from "react-router-dom";

import gql from "graphql-tag";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import {useMutation} from "react-apollo-hooks";
import ButtonMarkRead from "./ButtonMarkRead";
import ButtonMarkSpam from "./ButtonMarkSpam";
import queryString from "query-string";

function daysFromNow(date: string) {
    const m = moment(date);  // or whatever start date you have
    const today = moment().startOf('day');
    return Math.round(moment.duration(today - m).asDays());
}

function days2opacity(days: number): number {
    if (days < 1) {
        return 1;
    } else if (days < 2) {
        return 0.8
    } else if (days < 3) {
        return 0.6
    } else if (days < 7) {
        return 0.4
    }
    return 0.2;
}

export const fragment_article_list_item = gql`fragment fragment_article_list_item on Article{
    id
    title
    summary
    link
    time
    tags
    box
    priority
    feed{
        title
        link
    }
    series{
        id
        title
    }
}`;
let mutationMarkRead = gql`mutation markRead($id:String) {
    markReaded(id:$id){
        id
    }
}`;
const ArticleSingleLineListItem = ({data, onClickItem, match: {params: {box: route_box = "all"}}, location: {search},}) => {
    const {id, title, summary, link, time, tags = [], feed, box, priority, series = {}} = data;
    const {id: seriesId, title: seriesTitle} = series;
    const {t} = useTranslation("", {useSuspense: false});
    let {read = "all"} = queryString.parse(search);
    const markRead = useMutation(mutationMarkRead);
    let {feed_link, feed_title} = feed || {};
    let time_moment = moment(time);
    return (<div>
        <Paper elevation={1} className={styles.container} style={{opacity: days2opacity(daysFromNow(time))}} key={id}>
            <div className={styles.title_single_line}>
                <Typography variant="h5" onClick={async () => {
                    markRead({variables: {id: id}});
                    window.open(link, '_blank').opener = null
                }}>{title}</Typography>
                <Typography component="p" onClick={() => onClickItem && onClickItem({id})} className={styles.summary_single_line}>{summary}</Typography>
                <Typography title={time_moment.calendar()}>{time_moment.fromNow()}</Typography>
                <Typography>{t('feed')}: {feed_title || feed_link || ''}</Typography>
                {seriesId ? <Typography component={Link} to={`/series/${seriesId}`}>{t('Series')}: {seriesTitle || seriesId || ''}</Typography> : null}
                <div>
                    {read !== "readed" ? <ButtonMarkRead read={read} id={id}/> : null} {route_box !== "spam" ? <ButtonMarkSpam id={id}/> : null}
                </div>
            </div>
        </Paper>
    </div>);
};
export default withRouter(ArticleSingleLineListItem);