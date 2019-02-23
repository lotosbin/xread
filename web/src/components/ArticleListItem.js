import React from "react";
import styles from "./ArticleListItem.module.css"
import moment from "moment";

const ArticleListItem = ({data: {id, title, summary, link, time}}) => <div className={styles.container} key={id}>
    <p className={styles.title}><a href={link} target="_blank">{title}</a> <span title={moment(time).calendar()}>{moment(time).fromNow()}</span></p>
    <p className={styles.summary}>{summary}</p>
</div>;
export default ArticleListItem;