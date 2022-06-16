import type { NohmModel } from 'nohm'
import NodeCache from 'node-cache'

import { CACHE_CHECK_TTL_SECOND, CACHE_TTL_SECOND } from 'constants/cache'
import { redis } from 'services/redis'
import { SessionData } from './model' // init model

const cache = new NodeCache({
  stdTTL: CACHE_TTL_SECOND,
  checkperiod: CACHE_CHECK_TTL_SECOND,
  useClones: false,
})

/** load session from redis or create new one if not exist */
export const loadSession = async (sid: string): Promise<SessionData> => {
  let result: NohmModel
  try {
    result = await redis.factory('session', sid)
  } catch (err) {
    result = await redis.factory('session')
    result.property({
      id: sid,
      createdAt: new Date().valueOf(),
      updatedAt: new Date().valueOf(),
    })
    await result.save({ silent: true })
  }

  cache.set(sid, result)
  return result.allProperties()
}

/** get session from cache */
export const getSession = (sid): NohmModel | undefined => cache.get(sid)

export const updateSession = async (
  sid: string,
  props: Partial<SessionData>,
): Promise<SessionData | undefined> => {
  const result = getSession(sid)
  if (!result) return
  result.property({
    ...props,
    updatedAt: Date.now(),
  })
  await result.save({ silent: true })
  return result.allProperties()
}

export const deleteSession = async (sid: string) => {
  const result = await redis.factory('session', sid).catch(() => {})
  if (result) {
    await result.remove(true)
  }
  if (cache.has(sid)) {
    cache.del(sid)
  }
}
