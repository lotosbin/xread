import React from "react";
import InfiniteScroll from 'react-infinite-scroller';
import ArticleListItem from "./ArticleListItem";
import styles from "./ArticleList.module.css"
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const ArticleList = ({data: articles = [], loadMore, refetch, onClickItem, header}) => {
    return <div className={styles.container}>
        <div className={styles.refetch_container}>
            <Button className={styles.refetch} variant="outlined" onClick={refetch}>refetch</Button>
        </div>
        {articles.map((article) => <ArticleListItem key={article.id} data={article} onClickItem={onClickItem} header={header}/>)}
        <div className={styles.more_container}>
            {articles.length ? <Button className={styles.more} variant="outlined" onClick={loadMore}> More </Button> : <Typography>Empty</Typography>}
        </div>
    </div>;
};
export default ArticleList;