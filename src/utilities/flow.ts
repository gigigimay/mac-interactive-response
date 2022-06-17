import { FlowConfig, NodeConfig } from 'types/flow'

export const findNextNodeId = (
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
