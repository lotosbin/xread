import {Query} from "react-apollo";
import gql from "graphql-tag";
import React from "react";
import ArticleList from "./ArticleList";
import {fragment_article_list_item} from "./ArticleListItem";

const TopicArticleListContainer = ({match: {params: {feedId}}}) => <Query
    query={gql`query feed_articles($id:ID!,$cursor: String) {
    node(id:$id,type:"Feed"){
        id
        ... on Feed{
            articles(last:10,before: $cursor) {
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
   `}
    variables={{id: feedId, cursor: null}}
>
    {({loading, error, data, fetchMore, refetch}) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
        let {node: {articles = {edges: []}} = {}} = data || {};
        return <div>
            <div onClick={() => refetch()}>refetch</div>
            <ArticleList data={articles.edges.map(it => it.node)} loadMore={() => fetchMore({
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
</Query>;
export default TopicArticleListContainer;