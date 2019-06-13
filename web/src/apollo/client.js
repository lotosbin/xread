import {WebSocketLink} from 'apollo-link-ws';
import {split} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {getMainDefinition} from 'apollo-utilities';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import {onError} from 'apollo-link-error';
import {ApolloLink} from 'apollo-link';
import introspectionQueryResultData from '../generated/graphql.json';
import {setContext} from 'apollo-link-context';
import {getUser} from '../oauth'
// Create an http link:
const httpLink = new HttpLink({
    uri: process.env.REACT_APP_API_URL
});
const authLink = setContext(async (_, {headers}) => {
    // get the authentication token from local storage if it exists
    const user = await getUser();
    if (!user) {
        return headers;
    }
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: user.access_token ? `Bearer ${user.access_token}` : "",
        }
    }
});
const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_WEBSOCKET_URL,
    options: {
        reconnect: true
    }
});
// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
    // split based on operation type
    ({query}) => {
        const {kind, operation} = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
);

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
});
const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache({
        dataIdFromObject: obj => obj.id,
        addTypename: true,
        fragmentMatcher
    })
});
export default client;
