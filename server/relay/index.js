import _ from "lodash";

export function makeConnection(getArticles) {
    return async (args) => {
        let {first, after, last, before} = args;
        const articles = await getArticles({...args, first: first + 1});
        let edges = articles.slice(0, first).map(it => ({cursor: it.id, node: it}));
        return {
            pageInfo: {
                startCursor: _.chain(edges).map(it => it.cursor).first() || null,
                endCursor: _.chain(edges).map(it => it.cursor).last() || null,
                hasNextPage: !!(articles.length > first),
                hasPreviousPage: !!after,
            },
            edges: edges
        }
    }
}