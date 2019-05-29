import React from 'react';
import gql from "graphql-tag";
import {Link, Route, withRouter} from "react-router-dom";
import styles from "./Series.module.css"
import {useQuery} from "react-apollo-hooks";
import List from "@material-ui/core/List";
import {ListItem} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import SeriesArticleListContainer from './components/SeriesArticleListContainer'

const query = gql`{
    tags:series{
        edges{
            node{
                id
                name:title
            }
        }
    }
}`;
const Topic = () => {
    const {t, ready} = useTranslation("", {useSuspense: false});
    let variables = {};
    const {data: {tags}, fetchMore, refetch, loading, error} = useQuery(query, {variables});
    if (loading) return (<Typography component="p">{t('Loading')}...</Typography>);
    if (error) return (<Typography component="p">{t('Error')} !!!</Typography>);
    const list = tags.edges.map(it => it.node);
    return <div className={styles.container}>
        <List component={"nav"} className={styles.left}>
            {list.map(it => <ListItem key={it.id} button component={Link} className={styles.tag} to={`/series/${it.name}`}><ListItemText>{it.name}</ListItemText></ListItem>)}
        </List>
        <div className={styles.right}>
            <Route path="/series/:tag" component={SeriesArticleListContainer}/>
        </div>
    </div>
};
export default withRouter(Topic);