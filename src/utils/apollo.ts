
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';


export const client = new ApolloClient({
    uri: 'http://localhost:3002/graphql',
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
    },
    cache: new InMemoryCache({
        addTypename: false,
    }),
});