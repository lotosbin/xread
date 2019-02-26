import {Query} from "react-apollo";
import gql from "graphql-tag";
import React from "react";
import ArticleList from "./ArticleList";

const ArticleListContainer = () => <Query
    query={gql`query articles($cursor: String) {
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
    `}
    variables={{cursor: null}}
>
    {({loading, error, data: {articles}, fetchMore, refetch}) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        return <div>
            <div onClick={() => refetch()}>refetch</div>
            <ArticleList data={articles.edges.map(it => it.node)} loadMore={() => fetchMore({
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
            })}/>
        </div>;
    }}
</Query>;
export default ArticleListContainer;