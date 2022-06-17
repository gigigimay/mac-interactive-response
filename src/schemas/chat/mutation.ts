import gql from 'graphql-tag'

import { chat } from './fragment'

export const updateChatMutation = gql`
  mutation updateChat($input: UpdateChatInput!, $tenant: String) {
    updateChat(input: $input, tenant: $tenant) {
      ...chat
    }
  }
  ${chat}
`

export const appendNewMessageMutation = gql`
  mutation appendNewMessage($input: AppendNewMessageInput!, $tenant: String) {
    appendNewMessage(input: $input, tenant: $tenant) {
      ...chat
    }
  }
  ${chat}
`

export const autoAssignChat = gql`
  mutation autoAssignChat($input: AutoAssignChatInput!, $tenant: String) {
    autoAssignChat(input: $input, tenant: $tenant) {
      ...chat
    }
  }
  ${chat}
`
