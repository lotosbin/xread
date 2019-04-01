import {Mutation} from "react-apollo";
import gql from "graphql-tag";
import React from "react";
import ArticleList from "./ArticleList";
import _ from "lodash";
import {useMutation, useQuery} from "react-apollo-hooks";
import queryString from "query-string";
import {fragment_article_list_item} from "./ArticleListItem";

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
let mutationMarkSpam = gql`mutation markSpam($id:String) {
    markSpam(id:$id){
        id
    }
}
`;
let mutationMarkRead = gql`mutation markRead($id:String) {
    markReaded(id:$id){
        id
    }
}
`;
const ArticleListContainer = ({location: {search}, match: {params: {box = "all"}}}) => {

    const markSpam = useMutation(mutationMarkSpam);
    const markRead = useMutation(mutationMarkRead);
    let {read = "all"} = queryString.parse(search);
    let variables = {cursor: "", box: box, read: read};
    const {data: {articles}, fetchMore, refetch, loading, error} = useQuery(query, {variables});
    if (loading) return (<p>Loading...</p>);
    if (error) return (<p>Error !!!</p>);
    return <div>
        <div onClick={() => refetch()}>refetch</div>
        <ArticleList
            data={articles.edges.map(it => it.node)}
            header={({id}) => <div>
                {box !== "spam" ? <span onClick={() => markSpam({
                    variables: {id: id},
                    optimisticResponse: {
                        __typename: "Mutation",
                        markSpam: {
                            __typename: "Article",
                            id: id,
                        }
                    },
                    update: (proxy, {data: {markSpam: {id}}}) => {
                        console.log(`update:${id}`);
                        // Read the data from our cache for this query.
                        const data = proxy.readQuery({query: query, variables: variables});
                        console.log(`data`);
                        console.dir(data);
                        // Add our comment from the mutation to the end.
                        const find = _.find(data.articles.edges || [], {node: {id: id}});
                        if (find) {
                            console.log(`find`);
                            data.articles.edges = _.without(data.articles.edges || [], find) || [];
                            // Write our data back to the cache.
                            proxy.writeQuery({query: query, data});
                        }
                    }
                })}>Spam</span> : null}
                <span onClick={() => markRead({variables: {id: id}})}>mark read</span>
            </div>}
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

    </div>;
};
export default ArticleListContainer;