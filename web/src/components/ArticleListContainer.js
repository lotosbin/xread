import gql from "graphql-tag";
import React from "react";
import ArticleList from "./ArticleList";
import {useQuery} from "react-apollo-hooks";
import queryString from "query-string";
import {fragment_article_list_item} from "./ArticleListItem";
import {useTranslation} from "react-i18next";
import QueryContext from "../contexts/QueryContext";

let query = gql`query articles($cursor: String="",$box:String="all",$read:String="all") {
    articles(last:10,before: $cursor,box:$box,read:$read) {
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

    let {read = "all"} = queryString.parse(search);
    let variables = {cursor: "", box: box, read: read};
    const {data: {articles}, fetchMore, refetch, loading, error} = useQuery(query, {variables});
    if (loading) return (<p>{t('Loading')}...</p>);
    if (error) return (<p>{t('Error')} !!!</p>);
    return <div>
        <QueryContext.Provider value={{query, variables}}>
            <ArticleList
                refetch={() => refetch()}
                data={articles.edges.map(it => it.node)}
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