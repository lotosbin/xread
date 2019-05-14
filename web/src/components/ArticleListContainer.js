import gql from "graphql-tag";
import React, {useEffect} from "react";
import ArticleList from "./ArticleList";
import {useQuery} from "react-apollo-hooks";
import queryString from "query-string";
import {fragment_article_list_item} from "./ArticleListItem";
import {useTranslation} from "react-i18next";
import QueryContext from "../contexts/QueryContext";
import Typography from "@material-ui/core/Typography";

let query = gql`query articles($cursor: String="",$box:String="all",$read:String="all",$priority:Int) {
    articles(last:10,before: $cursor,box:$box,read:$read,priority:$priority) {
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


const ArticleListContainer = ({location: {search}, match: {params: {box = "all"}}}) => {
    const {t} = useTranslation("", {useSuspense: false});

    let {read = "all", priority = "0"} = queryString.parse(search);
    let variables = {cursor: "", box: box, read: read, priority: parseInt(priority)};
    const {data, fetchMore, refetch, loading, error} = useQuery(query, {variables});
    const {articles = {}} = data;
    const {edges = [], pageInfo = {}} = articles;
    useEffect(() => {
        const run = async () => {
            console.log(`useEffect run:${(edges || []).length},${pageInfo.hasNextPage}`);
            console.dir(data);
            if (edges.length === 0 && pageInfo.hasNextPage) {
                console.log(`useEffect run refetch`);
                refetch();
            }
        };
        run()
    }, [data]);
    if (loading) return (<Typography component="p">{t('Loading')}...</Typography>);
    if (error) return (<Typography component="p">{t('Error')} !!!</Typography>);
    return <div>
        <QueryContext.Provider value={{query, variables}}>
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
            /></QueryContext.Provider>
    </div>;
};
export default ArticleListContainer;