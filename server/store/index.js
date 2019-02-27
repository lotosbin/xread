import {createApolloFetch} from "apollo-fetch";
import {makeRemoteExecutableSchema, introspectSchema, transformSchema, RenameTypes, RenameRootFields, FilterRootFields} from "graphql-tools"
import {HttpLink} from 'apollo-link-http';

let uri = process.env.STORE_API_GRAPHQL_URL;
console.log(`STORE_API_GRAPHQL_URL=${uri}`);
const fetcher = createApolloFetch({uri: uri});


export const createStoreSchema = async () => {
    const introspectionResult = await introspectSchema(
        new HttpLink({uri: uri})
    );
    const schema = await makeRemoteExecutableSchema({
        schema: introspectionResult,
        link: new HttpLink({uri: uri}),
    });
    // const schema = makeRemoteExecutableSchema({
    //     schema: await introspectSchema(fetcher),
    //     fetcher,
    // });
    return transformSchema(schema, [
        new FilterRootFields((operation: string, rootField: string) => rootField === "feeds" || rootField === "node"),
        new RenameTypes((name: string) => `Store${name}`),
        new RenameRootFields((operation: 'Query' | 'Mutation' | 'Subscription', name: string) => `store_${name}`),
    ]);
};
