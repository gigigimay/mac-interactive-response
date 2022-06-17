import { SessionData } from 'session/model'
import {
  AnyEventObject,
  BaseActionObject,
  ResolveTypegenMeta,
  ServiceMap,
  State,
  StateMachine,
  StateNodeConfig,
  StateSchema,
  TypegenDisabled,
} from 'xstate'

export interface Context {
  session: SessionData
}

export type StateNodeConfigType = StateNodeConfig<
  Context,
  StateSchema,
  AnyEventObject
>

export type StateMachineType = StateMachine<
  Context,
  StateSchema,
  AnyEventObject
>

export type StateType = State<
  Context,
  AnyEventObject,
  StateSchema,
  {
    value: any
    context: Context
  },
  ResolveTypegenMeta<
    TypegenDisabled,
    AnyEventObject,
    BaseActionObject,
    ServiceMap
  >
>
