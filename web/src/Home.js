import React from 'react';
import {Subscription} from "react-apollo";
import gql from "graphql-tag";
import ArticleListContainer from "./components/ArticleListContainer";
import {Link, Route, withRouter} from "react-router-dom";
import TagArticleListContainer from "./components/TagArticleListContainer";
import TopicArticleListContainer from "./components/TopicArticleListContainer";
import styles from "./Home.module.css"
import queryString from 'query-string';
import SibeBar from "./components/SibeBar";

const Home = ({location: {pathname, search}}) => {

    return <div style={{display: "flex", flexDirection: "row", width: '100%'}}>
        <div className={styles.nav}>
            <SibeBar/>

        </div>
        <div style={{flexGrow: 1}}>
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
                <Link to={`?read=all`}>All</Link>
                <Link to={`?read=unread`}>Unread Only</Link>
            </div>

            <Route exact path="/article" component={ArticleListContainer}/>
            <Route path="/article/box/:box" component={ArticleListContainer}/>
            <Route path="/article/box/:box/read/:read" component={ArticleListContainer}/>
            <Route path="/article/tag/:tag" component={TagArticleListContainer}/>
            <Route path="/article/topic/:tag" component={TopicArticleListContainer}/>
        </div>
    </div>
};
export default withRouter(Home);