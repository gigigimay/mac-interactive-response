import express, { Express } from 'express'
import cors from 'cors'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import expressWinston from 'express-winston'

import { getFormat, getTransportOptions } from 'utilities/logger'
import sentryConfig from 'config/sentry'
import { botRouter } from 'webhook/bot'
import { errorHandler } from 'middlewares/error'

export const createApp = (): Express => {
  const app = express()

  Sentry.init({
    ...sentryConfig,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
  })

  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cors())

  app.use(
    expressWinston.logger({
      meta: true,
      ignoredRoutes: ['/'],
      level: 'http',
      format: getFormat('app.ts'),
      transports: getTransportOptions(),
      responseWhitelist: ['body'],
      // add custom res.body.status to the log message
      msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms (status: {{res.body.status}})',
    }),
  )

  app.use('/webhook/bot', botRouter)

  app.use(Sentry.Handlers.errorHandler())
  app.use(errorHandler)

  return app
}
