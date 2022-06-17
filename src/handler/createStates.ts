import { FlowConfig, NodeConfig, NodeType } from 'types/flow'
import { StateNodeConfigType } from 'types/state'
import { getLogger } from 'utilities/logger'
import { sendMessageState } from './actions/sendMessage'

const logger = getLogger('handler/flow.ts')

const findNextNodeId = (
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

export const createStates = (flowConfig: FlowConfig) => {
  const { nodes } = flowConfig
  const states: Record<string, StateNodeConfigType> = {}

  nodes.forEach((currentNode) => {
    const { id, type, data } = currentNode

    const createState = (): StateNodeConfigType | undefined => {
      let stateNodeConfig: StateNodeConfigType = {
        id: id,
        tags: [type],
      }

      switch (type) {
        case NodeType.waiting: {
          if (currentNode.data.type === 'end') {
            stateNodeConfig.type = 'final'
            return stateNodeConfig
          }
          const { conditions = [] } = data
          // TODO: dynamic condition types
          stateNodeConfig.on = {
            MESSAGE: conditions.map(({ id: conditionId, message }) => {
              const next = findNextNodeId(currentNode, flowConfig, conditionId)
              if (message) {
                return {
                  cond: (ctx, evt) => evt.text === message,
                  target: next,
                }
              }
              return next
            }),
          }
          return stateNodeConfig
        }
        case NodeType.sendMessage: {
          const next = findNextNodeId(currentNode, flowConfig)
          if (next) {
            stateNodeConfig = sendMessageState({
              id: id,
              next,
              text: data.value,
            })
          }
          return stateNodeConfig
        }
        // TODO: NodeType.assign
        // TODO: NodeType.initCase
        // TODO: NodeType.end
        default: {
          logger.warn(
            `warning: found unknown node type '${type}' in flow config`,
          )
          return undefined
        }
      }
    }

    const stateNodeConfig = createState()
    if (stateNodeConfig?.id) {
      states[stateNodeConfig.id] = stateNodeConfig
    }
  })

  return states
}
