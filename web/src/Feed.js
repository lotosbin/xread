import React from 'react';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {Link, Route, withRouter} from "react-router-dom";
import FeedSubscribeContainer from "./components/FeedSubscribeContainer";
import FeedList from "./components/FeedList";
import styles from './Feed.module.css'
import FeedArticleListContainer from "./components/FeedArticleListContainer";
import type {FeedListDataItem} from "./components/FeedList";

const Feed = ({history}) => {

    return <div className={styles.container}>
        <div className={styles.left}>
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
                        return <FeedList
                            data={list}
                            subscribeToNewFeeds={() => subscribeToMore({
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
                            })}
                            onClick={(item: FeedListDataItem) => history.push(`/feed/${item.id}/article`)}
                        />
                    }}
                </Query>
            </div>
        </div>
        <div className={styles.right}>
            <Route path={`/feed/:feedId/article`} component={FeedArticleListContainer}/>
        </div>
    </div>
};
export default withRouter(Feed);