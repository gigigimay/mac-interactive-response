import { ENVIRONMENT, LOGGING_ENABLED, SENTRY_DSN } from './env'

export default {
  dsn: SENTRY_DSN,
  enabled: LOGGING_ENABLED === 'true',
  environment: ENVIRONMENT,
  tracesSampleRate: 1.0,
}
