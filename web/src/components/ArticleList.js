import React from "react";
import InfiniteScroll from 'react-infinite-scroller';
import ArticleListItem from "./ArticleListItem";
import styles from "./ArticleList.module.css"

const ArticleList = ({data: articles, loadMore, onClickItem, header}) => <div className={styles.container}>
        {articles.map((article) => <ArticleListItem key={article.id} data={article} onClickItem={onClickItem} header={header}/>)}
    <div onClick={loadMore}>More
    </div>
</div>;
export default ArticleList;