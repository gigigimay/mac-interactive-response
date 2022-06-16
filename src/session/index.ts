import type { NohmModel } from 'nohm'
import NodeCache from 'node-cache'
import { CACHE_CHECK_TTL_SECOND, CACHE_TTL_SECOND } from 'constants/cache'
import { SessionData, SessionModel } from './model' // init model

const cache = new NodeCache({
  stdTTL: CACHE_TTL_SECOND,
  checkperiod: CACHE_CHECK_TTL_SECOND,
  useClones: false,
})

/** load session from redis or create new one if not exist */
export const loadSession = async (sid: string): Promise<SessionData> => {
  const model = new SessionModel()
  cache.set(sid, model)
  try {
    return await model.load(sid)
  } catch (err) {
    model.id = sid
    model.property({
      id: sid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    await model.save({ silent: true })
    return model.allProperties()
  }
}

/** get session from cache */
export const getSession = (sid): NohmModel | undefined => cache.get(sid)

export const updateSession = async (
  sid: string,
  props: Partial<SessionData>,
): Promise<SessionData | undefined> => {
  const model = getSession(sid)
  if (!model) return
  model.property({
    ...props,
    updatedAt: Date.now(),
  })
  await model.save({ silent: true })
  return model.allProperties()
}

export const deleteSession = async (sid: string) => {
  const model = new SessionModel()
  model.id = sid
  await model.remove(true).catch(() => {})
  if (cache.has(sid)) {
    cache.del(sid)
  }
}
