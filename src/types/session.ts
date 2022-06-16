/** session data that will return from redis in services/session.ts */
export interface SessionData {
  id: string
  /** if no caseId, it will return 0 */
  caseId: number
  tenant: string
  data: Record<string, any>
  createdAt: string
  updatedAt: string
}
