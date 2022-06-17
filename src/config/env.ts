import dotenv from 'dotenv'

dotenv.config()

export const NODE_ENV = process.env.NODE_ENV
export const PORT = Number(process.env.PORT || '8083')
export const IS_DEVELOPMENT_MODE = process.env.DEVELOPMENT_MODE === 'true'

export const APPSYNC_URL = process.env.APPSYNC_URL || ''
export const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY || ''
export const APPSYNC_REGION = process.env.APPSYNC_REGION || 'ap-southeast-1'
export const APPSYNC_AUTH_TYPE = process.env.APPSYNC_AUTH_TYPE || 'API_KEY'

export const REDIS_URL =
  process.env.REDIS_URL || 'redis://localhost:6379/0?password=XQ7pRIe6Ae'

// tenant config
export const FEATURES = process.env.FEATURES || 'mac-portal'
export const TENANT_CONFIG_URL = process.env.TENANT_CONFIG_URL
export const TENANT_CONFIG_TOKEN = process.env.TENANT_CONFIG_TOKEN
export const TENANT_CONFIG_RETRY_INTERVAL_TIME =
  Number(process.env.TENANT_CONFIG_RETRY_INTERVAL_TIME || 10) * 1000 // default 10 seconds
export const TENANT_CONFIG_REFRESH_SCHEDULE =
  process.env.TENANT_CONFIG_REFRESH_SCHEDULE || '*/30 * * * *' // default every 30 mins

// sentry
export const SENTRY_DSN = process.env.SENTRY_DSN
export const LOGGING_ENABLED = process.env.LOGGING_ENABLED
export const ENVIRONMENT = process.env.ENVIRONMENT
