import {addArticle, getArticles} from "./service";
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
type Article implements Node {
    id: ID!
    title: String
    summary: String
    link: String
    time: String
}

type ArticleConnection {
    pageInfo: PageInfo!
    edges: [ArticleEdge!]!
}
type ArticleEdge  {
    cursor: String!
    node: Article!
}

# The "Query" type is the root of all GraphQL queries.
# (A "Mutation" type will be covered later on.)
type Query {
    articles(first:Int,after:String,last:Int,before:String): ArticleConnection
    viewer: Viewer
    node(id: ID!): Node
}
type Mutation {
    addArticle(title: String, summary: String,link:String,time:String):Article
}
type Subscription {
    articleAdded: Article
}

`;
const ARTICLE_ADDED = "ARTICLE_ADDED";
// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
    Query: {
        articles: async (parent, args, context) => await makeConnection(getArticles)(args)
    },
    Mutation: {
        addArticle: async (root, args, context) => {
            let article = await addArticle(args);
            pubsub.publish(ARTICLE_ADDED, {articleAdded: article});
            return article;
        }
    },
    Subscription: {
        articleAdded: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator([ARTICLE_ADDED]),
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