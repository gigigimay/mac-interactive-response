import { createLogger, transports, format } from 'winston'
import Sentry from 'winston-transport-sentry-node'

import sentryConfig from 'config/sentry'
import { IS_DEVELOPMENT_MODE } from 'config/env'

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

export const getTransportOptions = () => [
  new transports.Console({ level: IS_DEVELOPMENT_MODE ? 'debug' : 'http' }),
  new Sentry({ sentry: sentryConfig, level: 'error' }),
]

export const getLogger = (label: string) => {
  return createLogger({
    format: getFormat(label),
    transports: getTransportOptions(),
  })
}
