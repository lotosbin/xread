import React from 'react';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {Link, Route, withRouter} from "react-router-dom";
import styles from "./Tag.module.css"

const Tag = () => {

    return <div>
        <Query query={gql`{
    tags{
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
                return list.map(it => <span className={styles.tag}><Link to={`/article/tag/${it.name}`}>{it.name}</Link></span>)
            }}
        </Query>
    </div>
};
export default withRouter(Tag);