import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import netlifyIdentity from "netlify-identity-widget";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";

import { mockLink } from "./mocks";
console.log(netlifyIdentity.currentUser());

export const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: ApolloLink.from([
    setContext((request, previousContext) => ({
      authorization: netlifyIdentity.currentUser().token.access_token
    })),
    onError(({ networkError }) => {
      console.log(networkError);
      if (networkError && networkError.status === 302) {
        console.log("redirect");
      }
    }),
    createHttpLink({
      uri: "https://sad-mccarthy.netlify.com/.netlify/functions/graphql"
    })
  ]),
  cache: new InMemoryCache()
});
