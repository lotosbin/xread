import React, {useEffect} from "react";

const FeedList = ({data, subscribeToNewFeeds}) => {
    useEffect(() => subscribeToNewFeeds());
    return data.map(it => <div key={it.id}><a href={it.link} target="_blank">{it.title || it.link}</a></div>)
};
export default FeedList;