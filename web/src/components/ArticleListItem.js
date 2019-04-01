import React from "react";
import styles from "./ArticleListItem.module.css"
import moment from "moment";
import {Link} from "react-router-dom";
import gql from "graphql-tag";

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
    return <div className={styles.container} style={{opacity: days2opacity(daysFromNow(time))}} key={id}>
        {header ? header({id}) : null}
        <p className={styles.title}><a href={link} target="_blank">{title}</a> <span title={time_moment.calendar()}>{time_moment.fromNow()}</span></p>
        <p onClick={() => onClickItem && onClickItem({id})} className={styles.summary}>{summary}</p>
        <div className={styles.foot}>
            <div>box:{box}</div>
            <div className={styles.tags}>tags:{tags.map(it => <span className={styles.tag}><Link to={`/article/tag/${it}`}>{it}</Link></span>)}</div>
            <div>feed: {feed_title || feed_link || ''}</div>
        </div>
    </div>;
};
export default ArticleListItem;