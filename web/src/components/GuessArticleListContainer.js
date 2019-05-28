import gql from "graphql-tag";
import React, {useEffect, useState} from "react";
import ArticleList from "./ArticleList";
import {useQuery} from "react-apollo-hooks";
import queryString from "query-string";
import {fragment_article_list_item} from "./ArticleListItem";
import {useTranslation} from "react-i18next";
import QueryContext from "../contexts/QueryContext";
import Typography from "@material-ui/core/Typography";
import styles from "./Guess.module.css";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ReadFilters from "./ReadFilters";
import ViewModeSwitch from "./ViewModeSwitch";
// import ScoreSlider from "./ScoreSlider";

let query = gql`query articles($cursor: String="",$box:String="all",$read:String="all",$priority:Int,$score:Float) {
    articles(last:10,before: $cursor,box:$box,read:$read,priority:$priority,search:{
        score:$score
    }) {
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
${fragment_article_list_item}
`;


const GuessArticleListContainer = (props) => {
    const {location: {search}, match: {params: {box = "inbox"}}} = props;
    const {t} = useTranslation("", {useSuspense: false});
    const [expanded, setExpanded] = React.useState('panel1');
    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    return (
        <div className={styles.container}>
            <div>
                <ReadFilters/><ViewModeSwitch/>
            </div>
            <div className={styles.article_list}>
                <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>{t("Guess Read")}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={styles.expansion_container}>
                        <ArticlePriorityList {...props} priority={"1"}/>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>{t("Guess Spam")}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={styles.expansion_container}>
                        <ArticlePriorityList {...props} priority={"-1"}/>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>{t("Guess Normal")}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={styles.expansion_container}>
                        <ArticlePriorityList {...props} priority={"0"}/>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        </div>
    );
};
const ArticlePriorityList = ({location: {search}, match: {params: {tag, box = "inbox"}}, priority = "0"}: TProps) => {
    let {read = "unread"} = queryString.parse(search);
    const {t, ready} = useTranslation("", {useSuspense: false});
    const [score, setScore] = useState(0.8);
    const variables = {tag: tag, cursor: null, read: read, priority: parseInt(priority), box: box};
    const {data, fetchMore, refetch, loading, error} = useQuery(query, {variables});
    // const {articles = {}} = data;
    // const {edges = [], pageInfo = {}} = articles;
    // useEffect(() => {
    //     const run = async () => {
    //         console.log(`useEffect run:${(edges || []).length},${pageInfo.hasNextPage}`);
    //         console.dir(data);
    //         if (edges.length === 0 && pageInfo.hasNextPage) {
    //             console.log(`useEffect run refetch`);
    //             refetch();
    //         }
    //     };
    //     run()
    // }, [data]);


    if (loading) return (<Typography component="p">{t('Loading')}...</Typography>);
    if (error) return (<Typography component="p">{t('Error')} !!!</Typography>);
    let {articles} = (data || {}) || {};

    return (

        <QueryContext.Provider value={{query, variables}}>
            {/*<ScoreSlider onChange={setScore}/>*/}
            <ArticleList
                refetch={() => refetch()}
                data={articles}
                loadMore={() => fetchMore({
                    variables: {
                        cursor: articles.pageInfo.endCursor
                    },
                    updateQuery: (previousResult, {fetchMoreResult}) => {
                        const newEdges = fetchMoreResult.articles.edges;
                        const pageInfo = fetchMoreResult.articles.pageInfo;

                        return newEdges.length
                            ? {
                                // Put the new comments at the end of the list and update `pageInfo`
                                // so we have the new `endCursor` and `hasNextPage` values
                                articles: {
                                    __typename: previousResult.articles.__typename,
                                    edges: [...previousResult.articles.edges, ...newEdges],
                                    pageInfo
                                }
                            }
                            : previousResult;
                    }
                })}
            />
        </QueryContext.Provider>
    );
};
export default GuessArticleListContainer;