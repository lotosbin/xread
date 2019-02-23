import _ from "lodash";

export function makeConnection(getArticles) {
    return async ({first, after, last, before}) => {
        const articles = await getArticles({first: first + 1, after, last, before});
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