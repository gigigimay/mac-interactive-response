import { WebhookEvent } from 'types/webhook'
import { AnyEventObject, createMachine, interpret } from 'xstate'
import { createStates } from './createStates'

import flowConfig from 'config/flows/count.json'
import { Context, StateMachineType, StateType } from 'types/state'
import { SessionData } from 'session/model'

const interpretStateMachine = (
  machine: StateMachineType,
  event: AnyEventObject,
  initialState: string,
): Promise<StateType | undefined> => {
  return new Promise((resolve) => {
    const machineService = interpret(machine)
      .onTransition((state) => {
        if (state.hasTag('waiting') && state.changed) {
          resolve(state)
        }
      })
      .onDone(() => resolve(undefined))
      .onStop(() => resolve(undefined))
      .start(initialState)

    machineService.send(event)
  })
}

export const handleState = async (
  event: WebhookEvent,
  session: SessionData,
) => {
  // TODO: dynamic flow entry + fallback flow
  const flowId = 'test-flow'
  session.flowId = flowId
  const initialState = session.stateId || 'start'

  const stateMachine = await createMachine<Context>({
    id: flowId,
    context: {
      session: session,
    },
    states: createStates(flowConfig),
  })

  const stateEvent: AnyEventObject = {
    type: 'MESSAGE',
    text: event.message.content.text,
  }

  const resultState = await interpretStateMachine(
    stateMachine,
    stateEvent,
    initialState,
  )

  if (resultState) {
    session.stateId = resultState.value.toString()
  }
}
