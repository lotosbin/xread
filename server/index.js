import {addArticle, addFeed, getArticles, getFeed, getFeeds, getTags, parseArticleKeywords} from "./service";
import {makeConnection} from "./relay";

const {ApolloServer, gql, PubSub} = require('apollo-server');
const pubsub = new PubSub();

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`# Comments in GraphQL are defined with the hash (#) symbol.
interface Node {
    id: ID!
}
type PageInfo {
    startCursor: String!,
    endCursor: String!,
    hasNextPage: Boolean!,
    hasPreviousPage: Boolean!
}
type Viewer{
    username: String
}
type Tag implements Node{
    id:ID!
    name: String!
    articles(first:Int,after:String,last:Int,before:String):ArticleConnection
}
type TagConnection {
    pageInfo: PageInfo!
    edges: [TagEdge!]!
}
type TagEdge  {
    cursor: String!
    node: Tag!
}
type Article implements Node {
    id: ID!
    title: String
    summary: String
    link: String
    time: String
    feed: Feed
    tags: [String]
}

type ArticleConnection {
    pageInfo: PageInfo!
    edges: [ArticleEdge!]!
}
type ArticleEdge  {
    cursor: String!
    node: Article!
}

type Feed implements Node{
    id:ID!
    link:String!
    title:String
    articles(first:Int,after:String,last:Int,before:String):ArticleConnection
}
type FeedConnection {
    pageInfo: PageInfo!
    edges: [FeedEdge!]!
}
type FeedEdge  {
    cursor: String!
    node: Feed!
}

# The "Query" type is the root of all GraphQL queries.
# (A "Mutation" type will be covered later on.)
type Query {
    articles(first:Int,after:String,last:Int,before:String): ArticleConnection
    viewer: Viewer
    node(id: ID!): Node
    feeds(first:Int,after:String,last:Int,before:String):FeedConnection
    tags:TagConnection
}
type Mutation {
    addArticle(title: String, summary: String,link:String,time:String,feedId:String):Article
    addFeed(link:String!,title:String):Feed
}
type Subscription {
    articleAdded: Article
    feedAdded:Feed
}

`;
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