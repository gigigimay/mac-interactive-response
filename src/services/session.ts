import { SessionData } from 'types/session'
import { redis } from './redis'

export const SessionModel = redis.model<SessionData>('session', {
  idGenerator() {
    return (this as any).property('id')
  },
  properties: {
    id: { type: 'string', unique: true },
    caseId: { type: 'number' },
    createdAt: { type: 'timestamp' },
    updatedAt: { type: 'timestamp' },
    tenant: { type: 'string' },
    data: { type: 'json', defaultValue: {} },
  },
})

/** load session from redis or create new one if not exist */
export const loadSession = async (
  sid: string,
  tenant: string,
): Promise<SessionData> => {
  try {
    const result = await redis.factory('session', sid)
    return result.allProperties()
  } catch (err) {
    const result = await redis.factory('session')
    result.property({
      id: sid,
      createdAt: new Date().valueOf(),
      updatedAt: new Date().valueOf(),
      tenant,
    })
    await result.save({ silent: true })
    return result.allProperties()
  }
}

export const updateSession = async (
  sid: string,
  data: Partial<SessionData>,
): Promise<SessionData> => {
  const model = await redis.factory('session', sid)
  model.property({ ...data, updatedAt: new Date().valueOf() })
  await model.save({ silent: true })
  return model.allProperties()
}

export const deleteSession = async (sid: string) => {
  const result = await redis.factory('session', sid).catch(() => {})
  if (result) {
    await result.remove(true)
  }
}
