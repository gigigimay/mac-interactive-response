import * as fp from 'lodash/fp'
import express from 'express'
import { getLogger } from 'utilities/logger'
import { getFeatures } from 'services/features'
import { IS_DEVELOPMENT_MODE } from 'config/env'
import handler from 'handler'

const logger = getLogger('webhooks/bot.ts')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('BOT WEBHOOK')
})

router.post('/process', async (req, res) => {
  const { name: tenant } = getFeatures(req.query.tenant as string)
  const { chatId, to, appId: caseId } = req.body.input
  const { owner, message, channel } = req.body.result

  // TODO: validate request and return 400

  logger.debug(`(/process) input:\n${JSON.stringify(req.body.input, null, 2)}`)

  if (owner !== 'bot' && to !== 'BOT') {
    return res.status(200).json({ status: 'skipped' })
  }

  const contentText = fp.getOr('', 'content.text', message)
  if (IS_DEVELOPMENT_MODE && contentText.toLowerCase() === 'clear') {
    // to clear data in development env
    // await deleteSession(chatId)
    logger.info(`Cleared session ${chatId} (clear)`)
    return res.status(200).json({ status: 'cleared' })
  }

  await handler({
    message,
    channel,
    chatId,
    caseId,
    tenant,
  })

  return res.status(200).json({ status: 'handled' })
})

router.post('/clearSession', async (req, res) => {
  const { chatId } = req.body.input
  /** deleting session when the chat is assigned via agent-tools (ex. promotion flow)
   * because when assigning, the bot state won't be cleared yet */
  // TODO: implement clearSession after connecting to redis
  // await deleteSession(chatId)
  logger.info(`Cleared session ${chatId} (/clearSession)`)
  return res.status(200).json({ status: 'cleared' })
})

export const botRouter = router
