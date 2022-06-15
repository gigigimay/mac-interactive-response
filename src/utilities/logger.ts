import { createLogger, transports, format } from 'winston'
import Sentry from 'winston-transport-sentry-node'

import sentryConfig from 'config/sentry'
import { DEVELOPMENT_MODE } from 'config/env'

const isDevelopmentMode = DEVELOPMENT_MODE === 'true'

export const getFormat = (label: string) => {
  return format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.label({ label }),
    format.printf(
      (lgr) =>
        `${lgr.timestamp} - ${lgr.level} - [${lgr.label}]: ${lgr.message}`,
    ),
  )
}

export const getLogger = (label: string) => {
  return createLogger({
    format: getFormat(label),
    transports: [
      new transports.Console({ level: isDevelopmentMode ? 'debug' : 'http' }),
      new Sentry({ sentry: sentryConfig, level: 'error' }),
    ],
  })
}
