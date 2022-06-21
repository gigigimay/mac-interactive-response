export enum NodeType {
  idle = 'idle',
  sendMessage = 'sendMessage',
}

export enum FlowType {
  normal = 'normal',
  fallback = 'fallback',
}

export interface NodeConfig {
  id: string
  type: string
  data: Record<string, any>
}

export interface EdgeConfig {
  id: string
  source: string
  sourceHandle?: string | null
  target: string
  targetHandle?: string | null
}

export interface FlowConfig {
  id: string
  name: string
  type: string
  priority: number
  nodes: NodeConfig[]
  edges: EdgeConfig[]
}

export interface EventCondition {
  id: string
  message: string
}
