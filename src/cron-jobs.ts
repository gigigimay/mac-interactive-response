import cron from 'node-cron'
import { TENANT_CONFIG_REFRESH_SCHEDULE } from 'config/env'
import { getLogger } from 'utilities/logger'
import { initFeatures } from 'services/features'

const logger = getLogger('cron.ts')

/** schedule to refresh features from tenant-config */
cron.schedule(TENANT_CONFIG_REFRESH_SCHEDULE, async () => {
  logger.info('refreshing features...')

  const clientFeatures = await initFeatures()
  // updateI18nResources(clientFeatures)

  logger.info('features have been updated')
})
