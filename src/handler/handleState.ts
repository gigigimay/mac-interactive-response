import { WebhookEvent } from 'types/webhook'
import { AnyEventObject, createMachine, interpret } from 'xstate'
import { createStates } from './createStates'

import {
  Context,
  EventType,
  MessageEvent,
  StateMachineType,
  StateType,
} from 'types/state'
import { SessionData } from 'session/model'
import { getFlowEntryConfig } from './getFlowEntryConfig'
import { NodeType } from 'types/flow'

const interpretStateMachine = (
  machine: StateMachineType,
  event: AnyEventObject,
  initialState: string,
): Promise<StateType | undefined> => {
  return new Promise((resolve) => {
    const machineService = interpret(machine)
      .onTransition((state) => {
        if (state.hasTag(NodeType.idle) && state.changed) {
          // save stateId to session so that user can continue later
          machine.context.session.stateId = state.value.toString()
          resolve(state)
        }
      })
      .onDone(() => {
        /** clear stateId and flowId when user finishes the flow
         * so user can go to play other flows
         */
        machine.context.session.stateId = ''
        machine.context.session.flowId = ''
        resolve(undefined)
      })
      .onStop(() => resolve(undefined))
      .start(initialState)

    machineService.send(event)
  })
}

export const handleState = async (
  event: WebhookEvent,
  session: SessionData,
) => {
  console.time('getFlowEntryConfig')
  const result = getFlowEntryConfig(event, session)
  console.timeEnd('getFlowEntryConfig')
  if (!result) return

  const { flowConfig, initialState } = result
  session.flowId = flowConfig.id

  console.time('createMachine')
  const stateMachine = await createMachine<Context>({
    id: session.flowId,
    context: {
      session: session,
    },
    states: createStates(flowConfig),
  })
  console.timeEnd('createMachine')

  const stateEvent: MessageEvent = {
    type: EventType.MESSAGE,
    message: event.message,
  }

  console.time('interpretStateMachine')
  await interpretStateMachine(stateMachine, stateEvent, initialState)
  console.timeEnd('interpretStateMachine')
}
