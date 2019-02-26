import React from 'react';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {Link, Route, withRouter} from "react-router-dom";
import FeedSubscribeContainer from "./components/FeedSubscribeContainer";
import FeedList from "./components/FeedList";

const Feed = () => {

    return <div>
        <Route path="/feed/subscribe" component={FeedSubscribeContainer}/>
        <Link to="/feed/subscribe">subscribe</Link>

        <div>
            <Query query={gql`{
    feeds(last:100){
        edges{
            node{
                id
                link
                title
            }
        }
    }
}`}>
                {({loading, error, data: {feeds}, fetchMore, refetch, subscribeToMore}) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;
                    const list = feeds.edges.map(it => it.node);
                    return <FeedList data={list} subscribeToNewFeeds={() => subscribeToMore({
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
    </div>
};
export default withRouter(Feed);