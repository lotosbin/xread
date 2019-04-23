// @flow
import {makeExecutableSchema} from "graphql-tools";
import {ApolloServer, gql} from "apollo-server";
import fs from "fs";
import resolvers from "./resolvers";

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
})();
