import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import expressWinston from 'express-winston'

import { getFormat, getLogger, getTransportOptions } from 'utilities/logger'
import { IS_DEVELOPMENT_MODE } from 'config/env'
import sentryConfig from 'config/sentry'
import { botRouter } from 'webhook/bot'

const logger = getLogger('app.ts')

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
      expressFormat: true,
      level: 'http',
      colorize: true,
      format: getFormat('app.ts'),
      transports: getTransportOptions(),
    }),
  )

  app.use('/webhook/bot', botRouter)

  app.use(Sentry.Handlers.errorHandler())

  // error handling
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    switch (err.name) {
      default:
        logger.error(err)
        return res.status(500).send({
          errors: [
            {
              msg: IS_DEVELOPMENT_MODE
                ? err.message
                : 'An unexpected error has occured.',
              code: 'unknown',
            },
          ],
        })
    }
  })

  return app
}
