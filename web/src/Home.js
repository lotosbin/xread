import React, {useState} from 'react';
import {Subscription} from "react-apollo";
import gql from "graphql-tag";
import ArticleListContainer from "./components/ArticleListContainer";
import {Route, withRouter} from "react-router-dom";
import TagArticleListContainer from "./components/TagArticleListContainer";
import TopicArticleListContainer from "./components/TopicArticleListContainer";
import styles from "./Home.module.css"
import SideBar from "./components/SideBar";
import {useTranslation} from "react-i18next";
import queryString from "query-string";
import ReadFilters from "./components/ReadFilters";
import ViewModeSwitch from "./components/ViewModeSwitch";
import {ViewModeContext} from "./contexts";

const Home = ({location: {pathname, search}}) => {
    let {read = "all"} = queryString.parse(search);
    const {t, ready} = useTranslation("", {useSuspense: false});
    return <div className={styles.container}>
        <div className={styles.nav}>
            <SideBar location={{search}}/>
        </div>

        <div className={styles.right}>
            <Subscription subscription={gql`subscription {
    articleAdded {
        id
        title
        summary
        link
        time
        tags
    }
}`}>
                {({data: {articleAdded} = {}, loading}) => articleAdded ? <h4>New article: {!loading && articleAdded.title}</h4> : null}
            </Subscription>
            <div>
                <ReadFilters/><ViewModeSwitch/>
            </div>
            <div className={styles.article_list}>
                <Route exact path="/article" component={ArticleListContainer}/>
                <Route path="/article/box/:box" component={ArticleListContainer}/>
                <Route path="/article/box/:box/read/:read" component={ArticleListContainer}/>
                <Route path="/article/tag/:tag" component={TagArticleListContainer}/>
                <Route path="/article/topic/:tag" component={TopicArticleListContainer}/>
            </div>

        </div>
    </div>
};
export default withRouter(Home);