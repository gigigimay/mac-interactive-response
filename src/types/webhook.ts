import { Message } from './chat'

export interface WebhookEvent {
  chatId: string
  tenant: string
  channel: string
  caseId?: number
  message: Message
}
