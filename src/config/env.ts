import dotenv from 'dotenv'
dotenv.config()

export const NODE_ENV = process.env.NODE_ENV
export const PORT = Number(process.env.PORT || '8083')

export const TENANT_CONFIG_REFRESH_INTERVAL_TIME =
  Number(process.env.TENANT_CONFIG_REFRESH_INTERVAL_TIME || 1800) * 1000 // default is 30 mins

export const DEVELOPMENT_MODE = process.env.DEVELOPMENT_MODE

export const SENTRY_DSN = process.env.SENTRY_DSN
export const LOGGING_ENABLED = process.env.LOGGING_ENABLED
export const ENVIRONMENT = process.env.ENVIRONMENT
