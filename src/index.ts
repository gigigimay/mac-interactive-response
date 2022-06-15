import express from 'express'
import cors from 'cors'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import '@sentry/tracing'
import dotenv from 'dotenv'

// import { initI18n, updateI18nResources } from 'services/i18n'
// import { connect } from 'services/redis'

import sentryConfig from 'config/sentry'
import { NODE_ENV, PORT } from 'config/env'
import { getLogger } from 'utilities/logger'
// import bot from 'webhook/bot'

dotenv.config()
const app = express()

Sentry.init({
  ...sentryConfig,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
})

app.use(Sentry.Handlers.requestHandler() as express.RequestHandler)
app.use(Sentry.Handlers.tracingHandler())

const logger = getLogger('index.js')

app.use(cors())
// app.use('/webhook/bot', bot())

app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler)

// const refreshFeatures = async () => {
//   logger.debug('refreshing features...')

//   const clientFeatures = await initFeatures()
//   updateI18nResources(clientFeatures)

//   logger.debug('features have been updated')
// }

// connect()
//   .then(async () => {
//     logger.debug('initializing features...')
//     const clientFeatures = await initFeatures()
//     await initI18n(clientFeatures)
//     logger.debug('features initialized')

//     /* polling to get the latest configuration */
//     setInterval(refreshFeatures, REFRESH_INTERVAL_TIME)
//   })
//   .then(() =>
//     app.listen(port, async (err) => {
//       if (err) {
//         logger.error(err)
//         throw err
//       } else {
//         logger.info(`Server started on port ${port}`)
//         logger.debug(`Server running in DEVELOPMENT_MODE`)
//       }
//     }))
//   .catch(logger.error)

// Optional fallthrough error handler
// app.use(function onError(err, req, res, next) {
//   // The error id is attached to `res.sentry` to be returned
//   // and optionally displayed to the user for support.
//   res.statusCode = 500;
//   res.end(res.sentry + "\n");
// });

app.listen(PORT, () => {
  logger.info(`${NODE_ENV || 'development'} server started on port ${PORT}`)
})
