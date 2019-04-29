import React from 'react';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {Link, Route, withRouter} from "react-router-dom";
import FeedSubscribeContainer from "./components/FeedSubscribeContainer";
import FeedList from "./components/FeedList";
import styles from './Feed.module.css'
import FeedArticleListContainer from "./components/FeedArticleListContainer";
import type {FeedListDataItem} from "./components/FeedList";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";

const query = gql`{
    feeds(last:100){
        edges{
            node{
                id
                link
                title
            }
        }
    }
}`;
const subscription = gql`subscription onFeedAdded {
    feedAdded {
        id
        link
        title
    }
}`;
const Feed = ({history}) => {
    const {t, ready} = useTranslation("", {useSuspense: false});
    return <div className={styles.container}>
        <div className={styles.left}>

            <Button variant={"outlined"} component={Link} to="/feed/subscribe">{t('subscribe')}</Button>
            <div>
                <Query query={query}>
                    {({loading, error, data: {feeds}, fetchMore, refetch, subscribeToMore}) => {
                        if (loading) return <p>{t('Loading')}...</p>;
                        if (error) return <p>{t('Error')} :(</p>;
                        const list = feeds.edges.map(it => it.node);
                        return <FeedList
                            data={list}
                            subscribeToNewFeeds={() => subscribeToMore({
                                document: subscription,
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
            <Route path="/feed/subscribe" component={FeedSubscribeContainer}/>
        </div>
    </div>
};
export default withRouter(Feed);