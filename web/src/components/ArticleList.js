import React from "react";
import InfiniteScroll from 'react-infinite-scroller';
import ArticleListItem from "./ArticleListItem";
import styles from "./ArticleList.module.css"

const ArticleList = ({data: articles, loadMore, onClickItem, header}) => <div className={styles.container}>
    <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={true || false}
        loader={<div className="loader" key={0}>Loading ...</div>}
        useWindow={false}
    >
        {articles.map((article) => <ArticleListItem key={article.id} data={article} onClickItem={onClickItem} header={header}/>)}
    </InfiniteScroll>

    <div onClick={loadMore}>More
    </div>
</div>;
export default ArticleList;