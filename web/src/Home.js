import React from 'react';
import {Subscription} from "react-apollo";
import gql from "graphql-tag";
import ArticleListContainer from "./components/ArticleListContainer";

const Home = () => {
    return <div>
        <Subscription subscription={gql`subscription {
    articleAdded {
        id
        title
        summary
        link
        time
    }
}`}>
            {({data: {articleAdded} = {}, loading}) => articleAdded ? <h4>New article: {!loading && articleAdded.title}</h4> : null}
        </Subscription>
        <ArticleListContainer/>
    </div>
};
export default Home;