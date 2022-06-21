import { EventCondition } from 'types/flow'
import {
  EventType,
  StateNodeConfigCreator,
  StateNodeConfigType,
} from 'types/state'
import { findNextNodeId, isMessageEventMatchedCondition } from 'utilities/flow'

export const idleState: StateNodeConfigCreator = (currentNode, flowConfig) => {
  const { id, type, data } = currentNode

  if (currentNode.data.type === 'end') {
    return {
      id: id,
      tags: [type],
      type: 'final',
    }
  }

  const conditions: EventCondition[] = data.conditions || []

  const result: StateNodeConfigType = {
    id: id,
    tags: [type],
    on: {
      [EventType.MESSAGE]: conditions.map((condition) => {
        const { id: conditionId } = condition
        const next = findNextNodeId(currentNode, flowConfig, conditionId)
        return {
          cond: (ctx, evt) =>
            isMessageEventMatchedCondition(evt.message, condition),
          target: next,
        }
      }),
    },
  }
  return result
}
