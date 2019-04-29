import React from 'react';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {Link, Route, withRouter} from "react-router-dom";
import styles from "./Topic.module.css"
import {useQuery} from "react-apollo-hooks";
import TopicArticleListContainer from "./components/TopicArticleListContainer";

const query = gql`{
    tags:topics{
        edges{
            node{
                id
                name
            }
        }
    }
}`;
const Topic = () => {
    let variables = {};
    const {data: {tags}, fetchMore, refetch, loading, error} = useQuery(query, {variables});
    if (loading) return (<p>Loading...</p>);
    if (error) return (<p>Error !!!</p>);
    const list = tags.edges.map(it => it.node);
    return <div className={styles.container}>
        <div className={styles.left}>
            {list.map(it => <span className={styles.tag}><Link to={`/topic/${it.name}`}>{it.name}</Link></span>)}
        </div>
        <div className={styles.right}>
            <Route path="/topic/:tag" component={TopicArticleListContainer}/>
        </div>
    </div>
};
export default withRouter(Topic);