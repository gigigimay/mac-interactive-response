import { loadSession, updateSession } from 'session'
import { Message } from 'types/chat'
import { getLogger } from 'utilities/logger'

const logger = getLogger('handler/index.ts')

interface HandlerArgs {
  chatId: string
  tenant: string
  channel: string
  caseId?: number
  message: Message
}

export const handleWebhookEvent = async (args: HandlerArgs): Promise<void> => {
  const { chatId, tenant, caseId, channel } = args
  const session = await loadSession(chatId)
  console.log('🚀 ~ loadSession', session)

  session.tenant = tenant
  session.channel = channel
  if (caseId) {
    session.caseId = caseId
  }

  // handle event

  await updateSession(chatId, session)
}
