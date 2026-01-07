import express from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { validate, validateParams } from '../middlewares/validate.js'
import Joi from 'joi'
import * as payController from '../controllers/pay.js'
import bodyParser from 'body-parser'

const router = express.Router()

const initiatePaySchema = Joi.object({
  order_id: Joi.number().integer().positive().required()
})

const orderIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
})

router.post('/wxpay', authMiddleware, validate(initiatePaySchema), payController.initiateWxPay)

router.post('/wxpay/callback', bodyParser.text({ type: 'text/xml' }), payController.wxPayCallback)

router.get('/status/:id', authMiddleware, validateParams(orderIdSchema), payController.queryOrderStatus)

export default router
