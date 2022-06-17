import gql from 'graphql-tag'

const profile = gql`
  fragment profile on Profile {
    userId
    displayName
    pictureUrl
  }
`

const message = gql`
  fragment message on Message {
    chatId
    id
    source {
      roomId
      channel
      owner
    }
    type
    createdDatetime
    content {
      text
      image
      flex
      template
    }
  }
`

export const customNote = gql`
  fragment customNote on CustomNote {
    agentId
    content
    updated_at
  }
`

export const resolveInfo = gql`
  fragment resolveInfo on ResolveInfo {
    agentId
    code
    note
    timestamp
  }
`

export const chat = gql`
  fragment chat on Chat {
    id
    chatId
    channel
    status
    statusType
    owner
    prevOwner
    code
    note
    assignedToTeam
    reassignRequestOwner
    customerFirstResponseTime
    profile {
      ...profile
    }
    nickname
    firstName
    lastName
    phoneNumber
    email
    appointmentDateTime
    address
    lastMessageTime
    lastMessage {
      ...message
    }
    tags
    createdDatetime
    isConsentAccepted
    isCustomerInfoSubmitted
    customNote {
      ...customNote
    }
    resolveInfo {
      ...resolveInfo
    }
    lastReadTime
  }
  ${profile}
  ${message}
  ${customNote}
  ${resolveInfo}
`
