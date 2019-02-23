import {WebSocketLink} from 'apollo-link-ws';
import {split} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {getMainDefinition} from 'apollo-utilities';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {onError} from 'apollo-link-error';
import {ApolloLink} from 'apollo-link';
// Create an http link:
const httpLink = new HttpLink({
    uri: process.env.REACT_APP_API_URL
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
    httpLink,
);
const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
});
export default client;
