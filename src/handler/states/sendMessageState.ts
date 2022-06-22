import { STATE_IDS } from 'constants/state'
import { appendNewMessageMutation } from 'schemas/chat/mutation'
import { appSyncClient } from 'services/app-sync'
import { UsageType } from 'types/chat'
import { Context, StateNodeConfigCreator } from 'types/state'
import { findNextNodeId } from 'utilities/flow'

// TODO: dynamic message type (text/flex/etc.)

const invokeSendMessage = async (ctx: Context, text: string) => {
  console.time(`🍀 Message sent! "${text}"`)
  await appSyncClient.mutate({
    mutation: appendNewMessageMutation,
    variables: {
      input: {
        chatId: ctx.session.id,
        caseId: ctx.session.caseId,
        from: 'BOT',
        to: ctx.session.channel || 'LINE',
        usageType: UsageType.Auto,
        createdDatetime: new Date().toISOString(),
        type: 'text',
        content: JSON.stringify({
          text,
        }),
      },
      tenant: ctx.session.tenant,
    },
  })
  console.timeEnd(`🍀 Message sent! "${text}"`)
}

export const sendMessageState: StateNodeConfigCreator = (
  currentNode,
  flowConfig,
) => {
  const { id, data } = currentNode

  /** default to 'end' state if can't find next node id */
  const next = findNextNodeId(currentNode, flowConfig) || STATE_IDS.END
  return {
    id,
    invoke: {
      id: `${id}_invokation`,
      src: (ctx) => invokeSendMessage(ctx, data.value),
      onDone: { target: `#${next}` },
      // onError: errorTarget,
    },
  }
}
