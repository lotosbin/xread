import React from "react";
import styles from "./ArticleListItem.module.css"
import moment from "moment";
import {Link} from "react-router-dom";
import MaterialLink from '@material-ui/core/Link';

import gql from "graphql-tag";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

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
    feed{
        title
        link
    }
}`;
const ArticleListItem = ({data: {id, title, summary, link, time, tags = [], feed, box}, onClickItem, header = null}) => {
    let {feed_link, feed_title} = feed || {};
    let time_moment = moment(time);
    return (<div>
        <Paper elevation={1} className={styles.container} style={{opacity: days2opacity(daysFromNow(time))}} key={id}>
            {header ? header({id}) : null}
            <div className={styles.title}>
                <Typography variant="h5" component="a" href={link} rel='noopener' target="_blank">{title}</Typography>
                <Typography title={time_moment.calendar()}>{time_moment.fromNow()}</Typography>
            </div>

            <Typography component="p">
                <p onClick={() => onClickItem && onClickItem({id})} className={styles.summary}>{summary}</p>
            </Typography>
            <div className={styles.foot}>
                <Typography>box:{box}</Typography>
                <Typography className={styles.tags}>tags:{tags.map(it => <span key={it} className={styles.tag}><Link to={`/article/tag/${it}`}>{it}</Link></span>)}</Typography>
                <Typography>feed: {feed_title || feed_link || ''}</Typography>
            </div>
        </Paper>
    </div>);
};
export default ArticleListItem;