import React, {useContext} from "react";
import InfiniteScroll from 'react-infinite-scroller';
import ArticleListItem from "./ArticleListItem";
import styles from "./ArticleList.module.css"
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import {ViewModeContext} from "../contexts";
import ArticleSingleLineListItem from "./ArticleSingleLineListItem";
import ButtonAllMarkSpam from "./ButtonAllMarkSpam";
import ButtonAllMarkRead from "./ButtonAllMarkRead";

type TArticleListProps = {
    data: {};
    refetch: ()=>{};
    loadMore: ()=>{};
}
const ArticleList = ({data = {}, loadMore, refetch, onClickItem}: TArticleListProps) => {
    const articles = (data.edges || []).map(it => it.node);
    const {hasNextPage = false, hasPreviousPage = true} = data.pageInfo || {};
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
            <div>
                <ButtonAllMarkSpam ids={articles.map(it => it.id)}/>
                <ButtonAllMarkRead ids={articles.map(it => it.id)}/>
            </div>
            <div>
                {!articles.length ? <Typography>{t('Empty')}</Typography> : null}
                {hasNextPage ? <Button className={styles.more} variant="outlined" onClick={loadMore}> {t('More')} </Button> : <Typography>{t('No More Content')}</Typography>}
            </div>
            <div></div>
        </div>
    </div>;
};
export default ArticleList;