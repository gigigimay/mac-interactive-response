import { NodeType } from 'types/flow'
import { StateNodeConfigCreator } from 'types/state'
import { idleState } from './idleState'
import { sendMessageState } from './sendMessageState'

export const stateCreatorsByNodeType: Record<string, StateNodeConfigCreator> = {
  [NodeType.idle]: idleState,
  [NodeType.sendMessage]: sendMessageState,
}
