import { loadSession, updateSession } from 'session'
import { WebhookEvent } from 'types/webhook'
import { handleState } from './handleState'

export const handleWebhookEvent = async (
  event: WebhookEvent,
): Promise<void> => {
  const { chatId } = event

  const session = await loadSession(chatId)

  session.tenant = event.tenant
  session.channel = event.channel

  if (event.caseId) {
    session.caseId = event.caseId
  }

  /** the 'session' object will be mutated inside */
  await handleState(event, session)

  await updateSession(chatId, session)
}
