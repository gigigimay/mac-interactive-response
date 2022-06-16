import Redis from 'ioredis'
import { Nohm as nohm } from 'nohm'

import { REDIS_URL } from 'config/env'
import { getLogger } from 'utilities/logger'

const logger = getLogger('services/redis.ts')

const redisClient = new Redis(REDIS_URL, { lazyConnect: true })

export const connect = async () => {
  await redisClient.connect()
  nohm.setClient(redisClient) // connect to ORM
  logger.info('redis connected')
}

export const disconnect = () => redisClient.quit()

export { nohm }
