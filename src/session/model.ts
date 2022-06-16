import { redis } from 'services/redis'

export interface SessionData {
  id: string
  channel: string
  tenant: string
  /** if no caseId, it will return 0 */
  caseId: number
  data: Record<string, any>
  createdAt: string
  updatedAt: string
}

export const SessionModel = redis.model<SessionData>('session', {
  idGenerator() {
    return (this as any).property('id')
  },
  properties: {
    id: { type: 'string', unique: true },
    channel: { type: 'string' },
    tenant: { type: 'string' },
    caseId: { type: 'number' },
    data: { type: 'json', defaultValue: {} },
    createdAt: { type: 'timestamp' },
    updatedAt: { type: 'timestamp' },
  },
})
