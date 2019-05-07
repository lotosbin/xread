import {Query} from "react-apollo";
import gql from "graphql-tag";
import React from "react";
import ArticleList from "./ArticleList";
import {fragment_article_list_item} from "./ArticleListItem";
import {useTranslation} from "react-i18next";
import QueryContext from "../contexts/QueryContext";
import ReadFilters from "./ReadFilters";
import queryString from "query-string";
import Typography from "@material-ui/core/Typography";

const query = gql`query feed_articles($id:ID!,$cursor: String,$read:String) {
    node(id:$id,type:"Feed"){
        id
        ... on Feed{
            articles(last:10,before: $cursor,box:"inbox",read: $read) {
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
const TopicArticleListContainer = ({location: {search}, match: {params: {feedId}}}) => {
    let {read = "unread"} = queryString.parse(search);
    const {t} = useTranslation("", {useSuspense: false});
    const variables = {id: feedId, cursor: null, read: read};
    return <div>
        <div>
            <ReadFilters/>
        </div>
        <QueryContext.Provider value={{query, variables}}>
            <Query query={query} variables={variables}>
                {({loading, error, data, fetchMore, refetch}) => {
                    if (loading) return <Typography component="p">{t('Loading')}...</Typography>;
                    if (error) return <Typography component="p">{t('Error')} !!!</Typography>;
                    let {node: {articles = {edges: []}} = {}} = data || {};
                    return <div>
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
                    </div>;
                }}
            </Query>
        </QueryContext.Provider>
    </div>;
};
export default TopicArticleListContainer;