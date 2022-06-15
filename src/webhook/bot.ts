import express from 'express'
import { getLogger } from 'utilities/logger'

const logger = getLogger('webhooks/bot.ts')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('BOT WEBHOOK')
})

router.get('/error', function mainHandler(req, res) {
  console.log('/error')
  logger.error('babanana', { tags: { bello: true } })
  throw new Error('Haaaa sipenyaaaa!')
})

export const botRouter = router
