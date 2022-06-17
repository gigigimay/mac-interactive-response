import gql from 'graphql-tag'

import { caseInfo } from './fragment'

export const listCasesQuery = gql`
  query listCases($input: ListCaseInput!, $tenant: String) {
    listCases(input: $input, tenant: $tenant) {
      count
      rows {
        ...case
      }
    }
  }
  ${caseInfo}
`

export const getCaseQuery = gql`
  query getCase($id: Int!, $tenant: String) {
    getCase(id: $id, tenant: $tenant) {
      ...case
    }
  }
  ${caseInfo}
`
