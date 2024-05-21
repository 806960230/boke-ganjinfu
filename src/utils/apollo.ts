
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error'; // 引入onError

const httpLink = createHttpLink({
    uri: 'http://localhost:3002/graphql',
});
const errorLink = onError(({
    graphQLErrors,
    networkError,
}) => {
    if (graphQLErrors) {

    }
    if (networkError) {

    }
});

export const client = new ApolloClient({
    link: errorLink.concat(httpLink),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
    },
    cache: new InMemoryCache({
        addTypename: false,
    }),
});