import express from 'express'
import cors from 'cors'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import '@sentry/tracing'
import dotenv from 'dotenv'

import { initFeatures } from 'services/features'
// import { initI18n, updateI18nResources } from 'services/i18n'
// import { connect } from 'services/redis'

import sentryConfig from 'config/sentry'
import { NODE_ENV, PORT } from 'config/env'
import { getLogger } from 'utilities/logger'
// import bot from 'webhook/bot'
import './cron-jobs'

dotenv.config()

const app = express()

Sentry.init({
  ...sentryConfig,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
})

const logger = getLogger('index.ts')

const init = async () => {
  // declare routes and middlewares
  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
  app.use(cors())
  // app.use('/webhook/bot', bot())
  app.use(Sentry.Handlers.errorHandler())

  // connect to redis

  // init features
  logger.info('initializing features...')
  const clientFeatures = await initFeatures()
  // await initI18n(clientFeatures)
  logger.info('features initialized')

  // start app
  app.listen(PORT, () => {
    logger.info(`${NODE_ENV || 'development'} server started on port ${PORT}`)
  })
}

init()
