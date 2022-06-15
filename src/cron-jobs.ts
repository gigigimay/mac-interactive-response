import cron, { validate } from 'node-cron'
import { TENANT_CONFIG_REFRESH_SCHEDULE as SCHEDULE } from 'config/env'
import { getLogger } from 'utilities/logger'
import { initFeatures } from 'services/features'

const logger = getLogger('cron-jobs.ts')

export const initCronJobs = () => {
  const isValid = validate(SCHEDULE)
  if (!isValid) {
    throw new Error(
      `invalid cron schedule '${SCHEDULE}', please check TENANT_CONFIG_REFRESH_SCHEDULE env`,
    )
  }

  /** schedule to refresh features from tenant-config */
  cron.schedule(SCHEDULE, async () => {
    logger.info('refreshing features...')
    const clientFeatures = await initFeatures()
    // updateI18nResources(clientFeatures)
    logger.info('features have been updated')
  })

  logger.info(
    `tenant config refreshing cron job scheduled with '${SCHEDULE}' expression`,
  )
}
