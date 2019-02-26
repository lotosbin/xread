import React from "react";
import styles from "./ArticleListItem.module.css"
import moment from "moment";
import {Link} from "react-router-dom";

const ArticleListItem = ({data: {id, title, summary, link, time, tags = []}}) => <div className={styles.container} key={id}>
    <p className={styles.title}><a href={link} target="_blank">{title}</a> <span title={moment(time).calendar()}>{moment(time).fromNow()}</span></p>
    <p className={styles.summary}>{summary}</p>
    <div className={styles.tags}>tags:{tags.map(it => <span className={styles.tag}><Link to={`/article/tag/${it}`}>{it}</Link></span>)}</div>
</div>;
export default ArticleListItem;