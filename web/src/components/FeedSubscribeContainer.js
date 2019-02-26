import React, {useState} from "react";
import gql from "graphql-tag";
import styles from "../FeedSubscribe.module.css";
import {Mutation} from "react-apollo";
import {withRouter} from "react-router-dom";
import query from "query-string";

const FeedSubscribeContainer = ({location: {search}, history}) => {
    const [url, setUrl] = useState(query.parse(search).url);
    const [title, setTitle] = useState("");

    return <Mutation mutation={gql`mutation addFeed($link:String!,$title:String) {
        addFeed(link:$link,title:$title){
            id
            link
            title
        }
    }`}>
        {(addFeed, {data}) => (
            <div className={styles.container}>
                <input type="text" value={url} onChange={event => setUrl(event.target.value)}/>
                <input type="text" value={title} onChange={event => setTitle(event.target.value)}/>
                <button onClick={e => {
                    e.preventDefault();
                    addFeed({variables: {link: url, title: title}});
                    history.push('/feed')
                }}>subscribe
                </button>
            </div>
        )}
    </Mutation>;
};
export default withRouter(FeedSubscribeContainer);