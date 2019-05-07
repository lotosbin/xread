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
}`;
let mutationMarkRead = gql`mutation markRead($id:String) {
    markReaded(id:$id){
        id
    }
}`;
const ArticleListItem = ({data: {id, title, summary, link, time, tags = [], feed, box, priority}, onClickItem, match: {params: {box: route_box = "all"}}, location: {search},}) => {
    const {t} = useTranslation("", {useSuspense: false});
    let {read = "all"} = queryString.parse(search);
    const markRead = useMutation(mutationMarkRead);
    let {feed_link, feed_title} = feed || {};
    let time_moment = moment(time);
    return (<div>
        <Paper elevation={1} className={styles.container} style={{opacity: days2opacity(daysFromNow(time))}} key={id}>
            <div>
                {read !== "readed" ? <ButtonMarkRead read={read} id={id}/> : null} {route_box !== "spam" ? <ButtonMarkSpam id={id}/> : null}
            </div>
            <div className={styles.title}>
                <Typography variant="h5" onClick={async () => {
                    markRead({variables: {id: id}});
                    window.open(link, '_blank').opener = null
                }}>{title}</Typography>
                <Typography title={time_moment.calendar()}>{time_moment.fromNow()}</Typography>
            </div>

            <Typography component="p">
                <p onClick={() => onClickItem && onClickItem({id})} className={styles.summary}>{summary}</p>
            </Typography>
            <div className={styles.foot}>
                <Typography>{t('box')}:{t(box)}</Typography>
                <Typography>{t('priority')}:{t(priority)}</Typography>
                <Typography className={styles.tags}>{t('tags')}:{tags.map(it => <span key={it} className={styles.tag}><Link to={`/article/tag/${it}`}>{it}</Link></span>)}</Typography>
                <Typography>{t('feed')}: {feed_title || feed_link || ''}</Typography>
            </div>
        </Paper>
    </div>);
};
export default withRouter(ArticleListItem);