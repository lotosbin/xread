import React, {useContext} from "react";
import InfiniteScroll from 'react-infinite-scroller';
import ArticleListItem from "./ArticleListItem";
import styles from "./ArticleList.module.css"
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import {ViewModeContext} from "../contexts";
import ArticleSingleLineListItem from "./ArticleSingleLineListItem";

type TArticleListProps = {
    data: [];
    refetch: ()=>{};
    loadMore: ()=>{};
    onClickItem: ()=>{};
}
const ArticleList = ({data: articles = [], loadMore, refetch, onClickItem}: TArticleListProps) => {
    const {t, ready} = useTranslation("", {useSuspense: false});
    const {mode: viewMode} = useContext(ViewModeContext);
    return <div className={styles.container}>
        <div className={styles.refetch_container}>
            <Button className={styles.refetch} variant="outlined" onClick={refetch}>{t('Refetch')}</Button>
        </div>
        {articles.map((article) => {
            switch (viewMode) {
                case "single_line":
                    return <ArticleSingleLineListItem key={article.id} data={article} onClickItem={onClickItem}/>;
                default:
                    return <ArticleListItem key={article.id} data={article} onClickItem={onClickItem}/>;
            }
        })}
        <div className={styles.more_container}>
            {articles.length ? <Button className={styles.more} variant="outlined" onClick={loadMore}> {t('More')} </Button> : <Typography>{t('Empty')}</Typography>}
        </div>
    </div>;
};
export default ArticleList;