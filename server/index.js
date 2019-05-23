// @flow
import {makeExecutableSchema} from "graphql-tools";
import {ApolloServer, gql} from "apollo-server";
import fs from "fs";
import resolvers from "./resolvers";
import {runParseArticlePriority} from "./job/priority";
import {runParseArticleKeywords} from "./job/keywords";
import {runParseArticleTopic} from "./job/topic";

const typeDefs = gql`${fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}`;
(async () => {
    let schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });
    const server = new ApolloServer({schema: schema});
    server.listen({port: 4000}).then(({url}) => {
        console.log(`🚀  Server ready at ${url}`);
    });
    // setInterval(runParseArticlePriority, 5000);
    // setInterval(runParseArticleKeywords, 5000);
    // setInterval(runParseArticleTopic, 5000);
})();
