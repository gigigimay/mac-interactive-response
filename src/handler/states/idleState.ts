import { EventType, StateNodeConfigCreator } from 'types/state'
import { findNextNodeId } from 'utilities/flow'

export const idleState: StateNodeConfigCreator = (currentNode, flowConfig) => {
  const { id, type, data } = currentNode

  if (currentNode.data.type === 'end') {
    return {
      id: id,
      tags: [type],
      type: 'final',
    }
  }

  const { conditions = [] } = data

  // TODO: dynamic condition types
  const onMessages = conditions.map(({ id: conditionId, message }) => {
    const next = findNextNodeId(currentNode, flowConfig, conditionId)
    if (!message) {
      return next
    }
    return {
      cond: (ctx, evt) => evt.text === message,
      target: next,
    }
  })

  return {
    id: id,
    tags: [type],
    // type: 'final', // FIXME
    on: {
      [EventType.MESSAGE]: onMessages,
    },
  }
}
