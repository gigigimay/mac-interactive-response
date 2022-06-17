import gql from 'graphql-tag'

export const caseInfo = gql`
  fragment case on Case {
    id
    appId
    chatId
    status
    owner
    resolveReason
    resolveSubReason
    currentForm
    chatSnapshot
    name
    updatedAt
    createdAt
    submittedAt
    latestFlowStartedAt
    firstAssignedAt
  }
`
