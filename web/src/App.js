import React, {Component} from 'react';

import './App.css';
import {ApolloProvider, Subscription} from "react-apollo";
import client from './apollo/client';
import ArticleListContainer from "./components/ArticleListContainer";
import gql from "graphql-tag";

class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <div className="App">
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
            </ApolloProvider>
        );
    }
}


export default App;
