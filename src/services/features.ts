import axios from 'axios'
import {
  FEATURES,
  TENANT_CONFIG_RETRY_INTERVAL_TIME,
  TENANT_CONFIG_TOKEN,
  TENANT_CONFIG_URL,
} from 'config/env'
import {
  Features,
  FetchFeaturesConfigResponse,
  RawClient,
} from 'types/features'
import { filterAOCClients, mappingFeatureFields } from 'utilities/features'
import { getLogger } from 'utilities/logger'

const logger = getLogger('services/features.ts')

const instance = axios.create({
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache',
    authorization: `Bearer ${TENANT_CONFIG_TOKEN}`,
  },
  baseURL: TENANT_CONFIG_URL,
})

export const fetchFeaturesConfig = async (): Promise<RawClient[]> => {
  const response = await instance.get<FetchFeaturesConfigResponse>(
    '/items/client',
    {
      params: {
        fields: 'id,name,aoc_config,aoc_features',
      },
    },
  )
  return filterAOCClients(response.data.data)
}

/** Features data for all tenants.
 *  This object will be automatically updated by polling */
let clientFeatures: Record<string, Features> = {}

export const getFeatures = (tenantName: string) => {
  const features = clientFeatures[tenantName]

  /** fallback to get from env if features not found */
  if (!features) return clientFeatures[FEATURES]
  return features
}

export const initFeatures = async () => {
  try {
    // fetch data
    const clientsConfig = await fetchFeaturesConfig()

    // transform data into record
    const newClientFeatures: Record<string, Features> = {}
    clientsConfig.forEach((config) => {
      newClientFeatures[config.name] = mappingFeatureFields(config)
    })

    // update(mutate) object
    clientFeatures = newClientFeatures
    return clientFeatures
  } catch (err: any) {
    if ([504, 502].includes(err.response?.status)) {
      // skip sending error to sentry if tenant-config service is starting
      logger.info(err)
    } else {
      logger.error(err)
    }

    logger.info(
      `init features failed, retrying in ${TENANT_CONFIG_RETRY_INTERVAL_TIME}ms...`,
    )

    // wait and retry again
    await new Promise((resolve) =>
      setTimeout(resolve, TENANT_CONFIG_RETRY_INTERVAL_TIME),
    )
    return initFeatures()
  }
}

export default {}
