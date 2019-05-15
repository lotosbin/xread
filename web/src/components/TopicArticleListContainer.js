// @flow
import gql from "graphql-tag";
import React, {useEffect} from "react";
import ArticleList from "./ArticleList";
import {fragment_article_list_item} from "./ArticleListItem";
import {useQuery} from "react-apollo-hooks";
import {useTranslation} from "react-i18next";
import QueryContext from "../contexts/QueryContext";
import ReadFilters from "./ReadFilters";
import queryString from "query-string";
import Typography from "@material-ui/core/Typography";
import GuessFilters from "./GuessFilters";
import styles from './TopicArticleList.module.css'
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const query = gql`query tag_articles($tag:ID!,$cursor: String,$read:String="all",$priority:Int) {
    node(id:$tag,type:"Topic"){
        id
        ... on Topic{
            name
            articles(last:10,before: $cursor,box:"inbox",read:$read,priority:$priority) {
                pageInfo{
                    startCursor
                    endCursor
                    hasNextPage
                    hasPreviousPage
                }
                edges{
                    cursor
                    node{
                        ...fragment_article_list_item
                    }
                }
            }
        }
    }
}
${fragment_article_list_item}
`;
type TProps = {}
const TopicArticleListContainer = (props: TProps) => {
    const {location: {search}, match: {params: {tag}}} = props;
    let {read = "unread", priority = "0"} = queryString.parse(search);
    const [expanded, setExpanded] = React.useState('panel1');
    useEffect(() => {
        const run = async () => {
            setExpanded("panel1")
        };
        run();
    }, [tag]);
    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const {t, ready} = useTranslation("", {useSuspense: false});
    const variables = {tag: tag, cursor: null, read: read, priority: parseInt(priority)};
    const {data, fetchMore, refetch, loading, error} = useQuery(query, {variables});
    if (loading) return (<Typography component="p">{t('Loading')}...</Typography>);
    if (error) return (<Typography component="p">{t('Error')} !!!</Typography>);
    let {articles} = (data || {}).node || {};
    return <div className={styles.container}>
        <div className={styles.toolbar}>
            <div>
                <ReadFilters/>
            </div>
        </div>
        <div className={styles.content}>
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>{t("Guess Read")}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={styles.expansion_container}>
                    <QueryContext.Provider value={{query, variables}}>
                        <ArticlePriorityList {...props} priority={"1"}/>
                    </QueryContext.Provider>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>{t("Guess Normal")}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={styles.expansion_container}>
                    <QueryContext.Provider value={{query, variables}}>
                        <ArticlePriorityList {...props} priority={"0"}/>
                    </QueryContext.Provider>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>{t("Guess Spam")}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={styles.expansion_container}>
                    <QueryContext.Provider value={{query, variables}}>
                        <ArticlePriorityList {...props} priority={"-1"}/>
                    </QueryContext.Provider>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    </div>;
};
const ArticlePriorityList = ({location: {search}, match: {params: {tag}}, priority = "0"}: TProps) => {
    let {read = "unread"} = queryString.parse(search);
    const {t, ready} = useTranslation("", {useSuspense: false});
    const variables = {tag: tag, cursor: null, read: read, priority: parseInt(priority)};
    const {data, fetchMore, refetch, loading, error} = useQuery(query, {variables});
    if (loading) return (<Typography component="p">{t('Loading')}...</Typography>);
    if (error) return (<Typography component="p">{t('Error')} !!!</Typography>);
    let {articles} = (data || {}).node || {};
    return (

        <QueryContext.Provider value={{query, variables}}>
            <ArticleList
                refrech={() => refetch()}
                data={articles}
                loadMore={() => fetchMore({
                    variables: {
                        cursor: articles.pageInfo.endCursor
                    },
                    updateQuery: (previousResult, {fetchMoreResult}) => {
                        const newEdges = fetchMoreResult.node.articles.edges;
                        const pageInfo = fetchMoreResult.node.articles.pageInfo;
                        return newEdges.length
                            ? {
                                // Put the new comments at the end of the list and update `pageInfo`
                                // so we have the new `endCursor` and `hasNextPage` values
                                node: {
                                    articles: {
                                        __typename: previousResult.node.articles.__typename,
                                        edges: [...previousResult.node.articles.edges, ...newEdges],
                                        pageInfo
                                    }
                                }
                            }
                            : previousResult;
                    }
                })}/>
        </QueryContext.Provider>
    );
};
export default TopicArticleListContainer;