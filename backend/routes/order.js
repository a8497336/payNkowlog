import express from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { validate, validateParams } from '../middlewares/validate.js'
import Joi from 'joi'
import * as orderController from '../controllers/order.js'

const router = express.Router()

const createOrderSchema = Joi.object({
  course_id: Joi.number().integer().positive().required(),
  coupon_id: Joi.number().integer().positive().optional()
})

const orderIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
})

router.post('/create', authMiddleware, validate(createOrderSchema), orderController.createOrder)

router.get('/:id', authMiddleware, validateParams(orderIdSchema), orderController.getOrderDetail)

router.get('/', authMiddleware, orderController.getOrderList)

export default router
