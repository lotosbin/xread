import React, {useEffect} from "react";
import styles from './FeedList.module.css'

export type FeedListDataItem = {
    id: string,
    title: string,
    link: string,
}
const FeedList = ({data, subscribeToNewFeeds, onClick}: { data: [FeedListDataItem], onClick: (FeedListDataItem)=>void }) => {
    useEffect(() => subscribeToNewFeeds());
    return data.map(it => <div className={styles.list_item} key={it.id}>
        {onClick ? <span onClick={() => onClick(it)}>{it.title || it.link}</span> : <a href={it.link} target="_blank">{it.title || it.link}</a>}
    </div>)
};
export default FeedList;