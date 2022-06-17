import { appendNewMessageMutation } from 'schemas/chat/mutation'
import { appSyncClient } from 'services/app-sync'
import { UsageType } from 'types/chat'
import { Context, StateNodeConfigCreator } from 'types/state'
import { findNextNodeId } from 'utilities/flow'

// TODO: send message to appsync
// TODO: dynamic message type (text/flex/etc.)

const sendMessage = async (ctx: Context, text: string) => {
  console.log(`🍀 Sending message... "${text}"`)
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
  console.log(`🍀 Message sent! "${text}"`)
}

export const sendMessageState: StateNodeConfigCreator = (
  currentNode,
  flowConfig,
) => {
  const { id, data } = currentNode
  const next = findNextNodeId(currentNode, flowConfig)
  return {
    id,
    invoke: {
      id: `${id}_invokation`,
      src: (ctx) => sendMessage(ctx, data.value),
      onDone: { target: `#${next}` },
      // onError: errorTarget,
    },
  }
}
