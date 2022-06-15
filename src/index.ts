import dotenv from 'dotenv'

import { initFeatures } from 'services/features'
// import { initI18n, updateI18nResources } from 'services/i18n'
// import { connect } from 'services/redis'
import { NODE_ENV, PORT } from 'config/env'
import { getLogger } from 'utilities/logger'

import { createApp } from './app'
import { initCronJobs } from './cron-jobs'

dotenv.config()

const logger = getLogger('index.ts')

const init = async () => {
  // init app
  const app = createApp()

  // connect to redis

  // init features
  logger.info('initializing features...')
  const clientFeatures = await initFeatures()
  // await initI18n(clientFeatures)
  logger.info('features initialized')

  initCronJobs()

  // start app
  app.listen(PORT, () => {
    logger.info(`${NODE_ENV || 'development'} server started on port ${PORT}`)
  })
}

init()
