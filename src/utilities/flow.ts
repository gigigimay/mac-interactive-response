import { Message } from 'types/chat'
import {
  EventCondition as IdleNodeCondition,
  FlowConfig,
  NodeConfig,
} from 'types/flow'

export const findNextNodeId = (
  currentNode: NodeConfig,
  flowConfig: FlowConfig,
  sourceHandle?: string,
): string | undefined => {
  const { nodes, edges } = flowConfig
  const edge = edges.find((e) => {
    return (
      e.source === currentNode.id &&
      (sourceHandle ? e.sourceHandle === sourceHandle : true)
    )
  })
  const nextNode = edge && nodes.find((n) => n.id === edge.target)
  const target = nextNode?.id
  return target
}

// TODO: dynamic condition types
export const isMessageEventMatchedCondition = (
  message: Message,
  condition: IdleNodeCondition,
) => {
  if (!condition.message) return true
  return message.content?.text === condition.message
}
