import React, {useEffect} from "react";
import styles from './FeedList.module.css'
const FeedList = ({data, subscribeToNewFeeds}) => {
    useEffect(() => subscribeToNewFeeds());
    return data.map(it => <div className={styles.list_item} key={it.id}><a href={it.link} target="_blank">{it.title || it.link}</a></div>)
};
export default FeedList;