import React from 'react';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {Link, Route, withRouter} from "react-router-dom";
import styles from "./Topic.module.css"
import {useQuery} from "react-apollo-hooks";
import TopicArticleListContainer from "./components/TopicArticleListContainer";
import List from "@material-ui/core/List";
import {ListItem} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";

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
        <List component={"nav"} className={styles.left}>
            {list.map(it => <ListItem key={it.id} button component={Link} className={styles.tag} to={`/topic/${it.name}`}><ListItemText>{it.name}</ListItemText></ListItem>)}
        </List>
        <div className={styles.right}>
            <Route path="/topic/:tag" component={TopicArticleListContainer}/>
        </div>
    </div>
};
export default withRouter(Topic);