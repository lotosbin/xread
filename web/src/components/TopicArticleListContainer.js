// @flow
import gql from "graphql-tag";
import React from "react";
import ArticleList from "./ArticleList";
import {fragment_article_list_item} from "./ArticleListItem";
import {useQuery} from "react-apollo-hooks";
import {useTranslation} from "react-i18next";
import QueryContext from "../contexts/QueryContext";
import ReadFilters from "./ReadFilters";
import queryString from "query-string";

const query = gql`query tag_articles($tag:ID!,$cursor: String,$read:String="all") {
    node(id:$tag,type:"Topic"){
        id
        ... on Topic{
            name
            articles(last:10,before: $cursor,box:"inbox",read:$read) {
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
const TopicArticleListContainer = ({location: {search}, match: {params: {tag}}}) => {
    let {read = "unread"} = queryString.parse(search);
    const {t, ready} = useTranslation("", {useSuspense: false});
    const variables = {tag: tag, cursor: null, read: read};
    const {data, fetchMore, refetch, loading, error} = useQuery(query, {variables});
    if (loading) return (<p>{t('Loading')}...</p>);
    if (error) return (<p>{t('Error')} !!!</p>);
    let {articles} = (data || {}).node || {};
    return <div>
        <div>
            <ReadFilters/>
        </div>
        <QueryContext.Provider value={{query, variables}}>
            <ArticleList
                refrech={() => refetch()}
                data={articles.edges.map(it => it.node)}
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
    </div>;
};
export default TopicArticleListContainer;