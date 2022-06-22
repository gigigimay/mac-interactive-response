import * as fp from 'lodash/fp'
import { WebhookEvent } from 'types/webhook'
import { SessionData } from 'session/model'

import allFlows from 'config/flows/all.json'
import { FlowConfig, FlowType } from 'types/flow'
import { isMessageEventMatchedCondition } from 'utilities/flow'
import { STATE_IDS } from 'constants/state'

const flows: FlowConfig[] = allFlows

const sortFlowPriority = (flows: FlowConfig[]) =>
  fp.sortBy(fp.pipe(fp.get('priority'), fp.multiply(-1)), flows)

const groupAndSortFlows = (flows: FlowConfig[]) => {
  const groups = fp.groupBy(fp.get('type'), flows)
  const normalFlows = sortFlowPriority(groups[FlowType.normal] || [])
  const fallbackFlows = sortFlowPriority(groups[FlowType.fallback] || [])
  return { normalFlows, fallbackFlows }
}

const findMatchedFlowByEvent = (flows: FlowConfig[], event: WebhookEvent) => {
  const matchedNormalFlow = flows.find((flow) => {
    const startNode = flow.nodes.find((node) => node.id === STATE_IDS.START)
    if (!startNode) return false
    const { conditions = [] } = startNode.data
    return conditions.some((c) =>
      isMessageEventMatchedCondition(event.message, c),
    )
  })
  return matchedNormalFlow
}

export const getFlowEntryConfig = (
  event: WebhookEvent,
  session: SessionData,
): { flowConfig: FlowConfig; initialState: string } | null => {
  const { normalFlows, fallbackFlows } = groupAndSortFlows(flows)

  /** (1.) normal flows */
  const matchedNormalFlow = findMatchedFlowByEvent(normalFlows, event)
  if (matchedNormalFlow) {
    return { flowConfig: matchedNormalFlow, initialState: STATE_IDS.START }
  }

  /** (2.) continue from current flow */
  if (session.flowId) {
    const currentFlow = flows.find((f) => f.id === session.flowId)
    if (currentFlow) {
      return {
        flowConfig: currentFlow,
        initialState: session.stateId || STATE_IDS.START,
      }
    }
  }

  /** (3.) fallback flows */
  const matchedFallbackFlow = findMatchedFlowByEvent(fallbackFlows, event)
  if (matchedFallbackFlow) {
    return { flowConfig: matchedFallbackFlow, initialState: STATE_IDS.START }
  }
  return null
}
