import {addArticle, addFeed, getArticles, getFeed, getFeeds, getTags, parseArticleKeywords} from "./service";
import {makeConnection} from "./relay";

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
            if (obj.name) {
                return "Tag"
            }
            return null
        }
    },
    Tag: {
        articles: async (parent, args, context) => {
            console.log(`Tag,parent=${JSON.stringify(parent)}`)
            return await makeConnection(getArticles)({...args, tag: parent.id});
        },
    },
    Article: {
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
        node: async (parent, args, context) => {
            if (args.id)
                return ({id: args.id, name: args.id});
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

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({typeDefs, resolvers});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});