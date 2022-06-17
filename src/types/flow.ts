export enum NodeType {
  idle = 'idle',
  sendMessage = 'sendMessage',
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
  nodes: NodeConfig[]
  edges: EdgeConfig[]
}
