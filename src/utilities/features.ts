import * as fp from 'lodash/fp'
import type { Features, RawClient } from 'types/features'

export const mappingTranslations = (clientFeatures = {}) => {
  const translationResources = {}

  Object.keys(clientFeatures).forEach((tenant) => {
    const featureValue = clientFeatures[tenant]
    const { translations } = featureValue
    translationResources[tenant] = translations
  })

  return translationResources
}

/** only return the data that has both `aoc_config` and `aoc_features` */
export const filterAOCClients = (clientsConfig: RawClient[]) => {
  return clientsConfig.filter(
    (clientConfig) =>
      fp.has('aoc_config', clientConfig) &&
      fp.has('aoc_features', clientConfig),
  )
}

/** transform raw data from tenant-config service into Features object */
export const mappingFeatureFields = (rawConfig: RawClient): Features => {
  return {
    tenantId: fp.get('id', rawConfig),
    name: fp.get('name', rawConfig),
    application: fp.get('aoc_config.bot_application_name', rawConfig),
    teams: fp.get('aoc_config.agent_groups_regex', rawConfig),
    workingHour: fp.get('aoc_config.working_hour', rawConfig),
    setting: {
      format: fp.get('aoc_config.number_format_config', rawConfig),
    },
    translations: fp.get('aoc_config.bot_custom_translations', rawConfig),
    lineLiffUrl: fp.get('aoc_config.line_liff_url', rawConfig),
    defaultClientUrl: fp.get('aoc_config.default_client_url', rawConfig),
    publicAssetVersion: fp.get('aoc_config.public_asset_version', rawConfig),
  }
}
