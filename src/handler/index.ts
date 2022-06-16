import { loadSession, updateSession } from 'services/session'
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

const handler = async (args: HandlerArgs): Promise<void> => {
  const { chatId, tenant } = args
  const session = await loadSession(chatId, tenant)

  // handle event

  await updateSession(chatId, { data: { test: 'newdata' } })
}

export default handler
