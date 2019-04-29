// @flow
import React, {useState} from "react";
import gql from "graphql-tag";
import styles from "./FeedSubscribe.module.css";
import {Mutation} from "react-apollo";
import {withRouter} from "react-router-dom";
import query from "query-string";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {useTranslation} from "react-i18next";

const FeedSubscribeContainer = ({location: {search}, history}) => {
    const {t} = useTranslation("", {useSuspense: false});
    const [url, setUrl] = useState(query.parse(search).url);
    const [title, setTitle] = useState(query.parse(search).title || "");

    return <Mutation mutation={gql`mutation addFeed($link:String!,$title:String) {
        addFeed(link:$link,title:$title){
            id
            link
            title
        }
    }`}>
        {(addFeed, {data}) => (
            <div className={styles.container}>
                <TextField margin="normal" variant="outlined" label={t("URL")} value={url} onChange={event => setUrl(event.target.value)}/>
                <TextField margin="normal" variant="outlined" label={t("Title")} value={title} onChange={event => setTitle(event.target.value)}/>
                <Button onClick={e => {
                    e.preventDefault();
                    addFeed({variables: {link: url, title: title}});
                    history.push('/feed')
                }}>{t('subscribe')}
                </Button>
            </div>
        )}
    </Mutation>;
};
export default withRouter(FeedSubscribeContainer);