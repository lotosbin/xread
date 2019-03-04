import {addArticle, addFeed, getArticles, getFeed, getFeeds, getTags, parseArticleKeywords} from "./service";
import {makeConnection} from "./relay";
import {makeExecutableSchema, addMockFunctionsToSchema, mergeSchemas} from "graphql-tools";
import {createStoreSchema} from "./store";
// Mocked chirp schema; we don't want to worry about schema implementation
// right now since we're just demonstrating schema stitching


const {ApolloServer, gql, PubSub} = require('apollo-server');
const pubsub = new PubSub();

const fs = require('fs');
const typeDefs = gql`${fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}`;
const ARTICLE_ADDED = "ARTICLE_ADDED";
const FEED_ADDED = "FEED_ADDED";
// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
    Node: {
        __resolveType: (obj, context, info) => {
            if (obj.__type) return obj.__type;
            if (obj.name) {
                return "Tag"
            } else if (obj.title) {
                if (obj.summary) {
                    return "Article"
                } else {
                    return "Feed"
                }
            }
            return null
        }
    },
    Tag: {
        articles: async (parent, args, context) => {
            console.log(`Tag,parent=${JSON.stringify(parent)}`);
            return await makeConnection(getArticles)({...args, tag: parent.id});
        },
    },
    Article: {
        summary: ({summary = ""}) => {
            return summary.replace(/<[^>]+>/g, "")
        },
        feed: ({id}, args, {}) => {
            return getFeed(id)
        },
        tags: async (article,) => {
            if (article.tags) {
                return article.tags;
            }
            try {
                let tags = await parseArticleKeywords(article);
                return tags || [];
            } catch (e) {
                console.log(e);
                return [];
            }
        }
    },
    Feed: {
        articles: async (parent, args, context) => await makeConnection(getArticles)({...args, feedId: parent.id}),
    },
    Query: {
        articles: async (parent, args, context) => await makeConnection(getArticles)(args),
        feeds: async (parent, args, context) => await makeConnection(getFeeds)(args),
        tags: async (parent, args, context) => await makeConnection(getTags)(args),
        node: async (parent, {id}, context) => {
            const feed = await getFeed(id);
            if (feed) {
                feed.id = feed._id;
                feed.__type = "Feed";
                return feed;
            }
            if (id)
                return ({id: id, name: id, __type: "Tag"});
            else
                return null
        },
    },
    Mutation: {
        addArticle: async (root, args, context) => {
            let article = await addArticle(args);
            pubsub.publish(ARTICLE_ADDED, {articleAdded: article});
            return article;
        },
        addFeed: async (root, args, context) => {
            let feed = await addFeed(args);
            pubsub.publish(FEED_ADDED, {feedAdded: feed});
            return feed;
        },
    },
    Subscription: {
        articleAdded: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator([ARTICLE_ADDED]),
        },
        feedAdded: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator([FEED_ADDED]),
        },
    },
};
export const serverSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
(async () => {
    let port, schema;
    if (process.env.STORE) {
        schema = mergeSchemas({
            schemas: [serverSchema],
        });
        port = 4001;
    } else {
        const storeSchema = await createStoreSchema();
        schema = mergeSchemas({
            schemas: [serverSchema, storeSchema],
        });
        port = 4000;
    }
    const server = new ApolloServer({schema: schema});
    server.listen({port: port}).then(({url}) => {
        console.log(`🚀  Server ready at ${url}`);
    });
})();
