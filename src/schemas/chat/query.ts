import gql from 'graphql-tag'

import { chat } from './fragment'

export const getChatQuery = gql`
  query getChat($chatId: String!, $tenant: String) {
    getChat(chatId: $chatId, tenant: $tenant) {
      ...chat
    }
  }
  ${chat}
`
