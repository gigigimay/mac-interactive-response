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
import { Message } from './chat'
import { FlowConfig, NodeConfig } from './flow'

export interface Context {
  session: SessionData
}

export interface MessageEvent extends AnyEventObject {
  message: Message
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

export enum EventType {
  MESSAGE = 'MESSAGE',
}

export type StateNodeConfigCreator = (
  currentNode: NodeConfig,
  flowConfig: FlowConfig,
) => StateNodeConfigType
