import {makeRemoteExecutableSchema, introspectSchema, transformSchema, RenameTypes, RenameRootFields, FilterRootFields} from "graphql-tools"
import fetch from 'node-fetch';
import {HttpLink} from 'apollo-link-http';

let uri = process.env.STORE_API_GRAPHQL_URL;
console.log(`STORE_API_GRAPHQL_URL=${uri}`);


export const createStoreSchema = async () => {
    const introspectionResult = await introspectSchema(
        new HttpLink({uri: uri, fetch})
    );
    const schema = await makeRemoteExecutableSchema({
        schema: introspectionResult,
        link: new HttpLink({uri: uri, fetch}),
    });
    return transformSchema(schema, [
        new FilterRootFields((operation: string, rootField: string) => rootField === "feeds" || rootField === "node"),
        new RenameTypes((name: string) => `Store${name}`),
        new RenameRootFields((operation: 'Query' | 'Mutation' | 'Subscription', name: string) => `store_${name}`),
    ]);
};
