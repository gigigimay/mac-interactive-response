import { STATE_IDS } from 'constants/state'
import { FlowConfig } from 'types/flow'
import { StateNodeConfigType } from 'types/state'
import { getLogger } from 'utilities/logger'

import { stateCreatorsByNodeType } from './states'

const logger = getLogger('handler/createStates.ts')

const validateStates = (states: Record<string, StateNodeConfigType>) => {
  if (!states[STATE_IDS.START]) {
    return `Required node id '${STATE_IDS.START}' not found`
  }
  if (!states[STATE_IDS.END]) {
    return `Required node id '${STATE_IDS.END}' not found`
  }
}

export const createStates = (flowConfig: FlowConfig) => {
  const { nodes, id } = flowConfig

  const states: Record<string, StateNodeConfigType> = {}

  nodes.forEach((currentNode) => {
    const { type } = currentNode
    const createState = stateCreatorsByNodeType[type]

    if (!createState) {
      return logger.warn(`Found unknown node type '${type}' in flow '${id}'`)
    }

    const stateNodeConfig = createState(currentNode, flowConfig)
    if (stateNodeConfig?.id) {
      states[stateNodeConfig.id] = stateNodeConfig
    }
  })

  const errorMessage = validateStates(states)
  if (errorMessage) {
    throw new Error(`Invalid configutation for flow '${id}': ${errorMessage}`)
  }

  return states
}
