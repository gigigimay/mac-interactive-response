import { FlowConfig } from 'types/flow'
import { StateNodeConfigType } from 'types/state'
import { getLogger } from 'utilities/logger'

import { stateCreatorsByNodeType } from './states'

const logger = getLogger('handler/createStates.ts')

export const createStates = (flowConfig: FlowConfig) => {
  const { nodes } = flowConfig

  const states: Record<string, StateNodeConfigType> = {}

  nodes.forEach((currentNode) => {
    const { type } = currentNode
    const createState = stateCreatorsByNodeType[type]

    if (!createState) {
      return logger.warn(`warning: unknown node type '${type}'`)
    }

    const stateNodeConfig = createState(currentNode, flowConfig)
    if (stateNodeConfig?.id) {
      states[stateNodeConfig.id] = stateNodeConfig
    }
  })

  return states
}
