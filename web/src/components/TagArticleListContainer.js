import {Query} from "react-apollo";
import gql from "graphql-tag";
import React from "react";
import ArticleList from "./ArticleList";

const TagArticleListContainer = ({match: {params: {tag}}}) => <Query
    query={gql`query tag_articles($tag:ID!,$cursor: String) {
    node(id:$tag){
        id
        ... on Tag{
            name
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
                        id
                        title
                        summary
                        link
                        time
                        tags
                    }
                }
            }
        }
    }

}
    `}
    variables={{tag: tag, cursor: null}}
>
    {({loading, error, data: {node}, fetchMore, refetch}) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
        let {articles} = node || {};
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
export default TagArticleListContainer;