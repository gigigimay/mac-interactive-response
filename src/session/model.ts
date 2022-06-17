import { NohmModel, TTypedDefinitions } from 'nohm'
import { nohm } from 'services/redis'

export interface SessionData {
  id: string
  channel: string
  tenant: string
  /** if no caseId, it will return 0 */
  caseId: number
  flowId?: string
  stateId?: string
  data: Record<string, any>
  createdAt: string
  updatedAt: string
}

class SessionModelClass extends NohmModel<SessionData> {
  protected static modelName = 'session'

  protected static definitions: TTypedDefinitions<SessionData> = {
    id: { type: 'string' },
    channel: { type: 'string' },
    tenant: { type: 'string' },
    caseId: { type: 'number' },
    flowId: { type: 'string' },
    stateId: { type: 'string' },
    data: { type: 'json', defaultValue: {} },
    createdAt: { type: 'timestamp' },
    updatedAt: { type: 'timestamp' },
  }

  public idGenerator() {
    return this.property('id')
  }
}

export const SessionModel = nohm.register(SessionModelClass)
