import React, {useEffect} from "react";

const FeedList = ({data, subscribeToNewFeeds}) => {
    useEffect(() => subscribeToNewFeeds());
    return data.map(it => <div key={it.id}>{it.title || it.link}</div>)
};
export default FeedList;