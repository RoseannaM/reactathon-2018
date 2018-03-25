import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import netlifyIdentity from "netlify-identity-widget";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";

import { mockLink } from "./mocks";

export const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: ApolloLink.from([
    setContext((request, previousContext) => ({
      headers: {
        authorization: `Bearer ${
          netlifyIdentity.currentUser().token.access_token
        }`
      }
    })),
    onError(error => {
      if (error.networkError && error.networkError.statusCode === 401) {
        console.log(error);
        window.location = error.networkError.bodyText;
      }
    }),
    // process.env.NODE_ENV === "production"
    false
      ? createHttpLink({
          uri: "https://sad-mccarthy.netlify.com/.netlify/functions/graphql",
          credentials: "include"
        })
      : mockLink
  ]),
  cache: new InMemoryCache()
});
