import gql from 'graphql-tag'

import { caseInfo } from './fragment'

export const createCaseMutation = gql`
  mutation createCase($input: CreateCaseInput!, $tenant: String) {
    createCase(input: $input, tenant: $tenant) {
      ...case
    }
  }
  ${caseInfo}
`

export const updateCaseMutation = gql`
  mutation updateCase($input: UpdateCaseInput!, $tenant: String) {
    updateCase(input: $input, tenant: $tenant) {
      ...case
    }
  }
  ${caseInfo}
`
