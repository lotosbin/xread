import React, {useEffect} from "react";
import {Link} from "react-router-dom";

const StoreFeedDetail = ({data}) => {
    return <div>
        <h1>{data.title}</h1>
        {
            data.articles.edges.map(it => it.node).map(article => <div>{article.title}</div>)
        }
    </div>
};
export default StoreFeedDetail;