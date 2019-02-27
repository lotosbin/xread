import React from 'react';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {Route, withRouter} from "react-router-dom";
import styles from "./Store.module.css"
import StoreFeedList from "./components/StoreFeedList";
import StoreFeedDetail from "./components/StoreFeedDetail";
import StoreFeedDetailContainer from "./components/StoreFeedDetailContainer";

const Store = () => {

    return <div className={styles.container}>
        <div>
            <Query query={gql`{
    feeds:store_feeds(last:100){
        edges{
            node{
                id
                link
                title
            }
        }
    }
}`}>
                {({loading, error, data, fetchMore, refetch, subscribeToMore}) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;
                    let {feeds = []} = data || {};
                    const list = feeds.edges.map(it => it.node);
                    return <StoreFeedList data={list} subscribeToNewFeeds={() => subscribeToMore({
                        document: gql`subscription onFeedAdded {
    feedAdded {
        id
        link
        title
    }
}`,
                        updateQuery: (prev, {subscriptionData}) => {
                            if (!subscriptionData.data) return prev;
                            const newFeed = subscriptionData.data.feedAdded;
                            const newEdge = {cursor: newFeed.id, node: newFeed};
                            return Object.assign({}, prev, {
                                feeds: {
                                    edges: [newEdge, ...prev.feeds.edges]
                                }
                            });
                        }
                    })}/>
                }}
            </Query>
        </div>
        <div>
            <Route path="/store/feed/:feedId" component={StoreFeedDetailContainer}/>
        </div>
    </div>
};
export default withRouter(Store);