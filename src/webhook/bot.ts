import express from 'express'
import { getLogger } from 'utilities/logger'

const logger = getLogger('webhooks/bot.ts')

const botRouter = express.Router()

botRouter.get('/', (req, res) => {
  console.log('/ping')
  res.send('pong')
})

botRouter.get('/error', function mainHandler(req, res) {
  console.log('/error')
  logger.error('babanana', { tags: { bello: true } })
  throw new Error('Haaaa sipenyaaaa!')
})

export default botRouter
