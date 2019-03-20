import React from "react";
import styles from "./ArticleListItem.module.css"
import moment from "moment";
import {Link} from "react-router-dom";

const ArticleListItem = ({data: {id, title, summary, link, time, tags = [], feed}, onClickItem, header = null}) => {
    let {feed_link, feed_title} = feed || {};
    return <div className={styles.container} key={id}>
        {header ? header({id}) : null}
        <p className={styles.title}><a href={link} target="_blank">{title}</a> <span title={moment(time).calendar()}>{moment(time).fromNow()}</span></p>
        <p onClick={() => onClickItem && onClickItem({id})} className={styles.summary}>{summary}</p>
        <div className={styles.foot}>
            <div className={styles.tags}>tags:{tags.map(it => <span className={styles.tag}><Link to={`/article/tag/${it}`}>{it}</Link></span>)}</div>
            <div>feed: {feed_title || feed_link || ''}</div>
        </div>
    </div>;
};
export default ArticleListItem;