import 'isomorphic-fetch'
import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { AuthOptions, createAuthLink } from 'aws-appsync-auth-link'

import {
  APPSYNC_API_KEY,
  APPSYNC_AUTH_TYPE,
  APPSYNC_REGION,
  APPSYNC_URL,
} from 'config/env'

const url = APPSYNC_URL
const region = APPSYNC_REGION
const auth = {
  type: APPSYNC_AUTH_TYPE,
  apiKey: APPSYNC_API_KEY,
}

const httpLink = createHttpLink({ uri: url })

const link = ApolloLink.from([
  createAuthLink({
    url,
    region,
    auth: auth as AuthOptions,
  }),
  httpLink,
])

export const appSyncClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
})
