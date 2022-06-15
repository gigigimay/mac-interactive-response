export interface RawClient {
  id: string
  name: string
  aoc_config?: Record<string, any>
  aoc_features?: Record<string, any>
}

export interface FetchFeaturesConfigResponse {
  data: RawClient[]
}

export interface Features {
  tenantId: string
  name: string
  application?: string | null
  teams?: Record<string, string> | null
  workingHour?: Record<string, number> | null
  setting: {
    format?: Record<string, any> | null
  }
  translations?: Record<string, any> | null
  lineLiffUrl?: string | null
  defaultClientUrl?: string | null
  publicAssetVersion?: string | null
}
