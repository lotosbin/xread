import React from 'react';
import {Subscription} from "react-apollo";
import gql from "graphql-tag";
import ArticleListContainer from "./components/ArticleListContainer";
import {Route} from "react-router-dom";
import TagArticleListContainer from "./components/TagArticleListContainer";
import TopicArticleListContainer from "./components/TopicArticleListContainer";

const Home = () => {
    return <div>
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
        <Route exact path="/article" component={ArticleListContainer}/>
        <Route path="/article/tag/:tag" component={TagArticleListContainer}/>
        <Route path="/article/topic/:tag" component={TopicArticleListContainer}/>
    </div>
};
export default Home;