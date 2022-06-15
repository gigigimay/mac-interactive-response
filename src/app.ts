import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

import sentryConfig from 'config/sentry'
import { getLogger } from 'utilities/logger'
import botRouter from 'webhook/bot'
import { IS_DEVELOPMENT_MODE } from 'config/env'

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

  app.use(cors())

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
