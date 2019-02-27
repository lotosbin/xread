import React from "react";
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {withRouter} from "react-router-dom";

const StoreFeedDetailContainer = ({match: {params: {feedId}}}) => {
    console.log(`feedId:${feedId}`)
    return <Query query={gql`query StoreFeedDetailContainer($id:ID!){
        node:store_node(id:$id){
        id
        ... on StoreFeed{
            id
            link
            title
            articles(last:5){
                edges{
                    node{
                        title
                    }
                }
            }
        }
    }
    }`}
                  variables={{id: feedId}}>
        {({loading, error, data}) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            let {node: feed = {}} = data;
            let {articles: {edges = []} = {}} = feed;
            return <div>
                <h1>{feed.title}</h1>
                <div>
                    {edges.map(it => it.node).map(article => <div>{article.title}</div>)}
                </div>
            </div>
        }}
    </Query>;
};

export default withRouter(StoreFeedDetailContainer);