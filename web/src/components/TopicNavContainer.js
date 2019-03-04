import React from 'react';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {Link, Route, withRouter} from "react-router-dom";
import styles from "./TopicNav.module.css"

const TopicNavContainer = () => {

    return <div className={styles.container}>
        <Query query={gql`{
    tags:topics{
        edges{
            node{
                id
                name
            }
        }
    }
}`}>
            {({loading, error, data: {tags}}) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error :(</p>;
                const list = tags.edges.map(it => it.node);
                return list.map(it => <span className={styles.tag}><Link to={`/article/topic/${it.name}`}>{it.name}</Link></span>)
            }}
        </Query>
    </div>
};
export default withRouter(TopicNavContainer);