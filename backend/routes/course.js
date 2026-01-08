import express from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { validateParams, validateQuery } from '../middlewares/validate.js'
import Joi from 'joi'
import * as courseController from '../controllers/course.js'

const router = express.Router()

const courseIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
})

const courseListSchema = Joi.object({
  category_id: Joi.number().integer().positive().optional(),
  sort: Joi.string().valid('sales', 'price_asc', 'price_desc').optional(),
  page: Joi.number().integer().min(1).optional(),
  size: Joi.number().integer().min(1).max(100).optional()
})

const searchSchema = Joi.object({
  keyword: Joi.string().min(1).required(),
  page: Joi.number().integer().min(1).optional(),
  size: Joi.number().integer().min(1).max(100).optional()
})

router.get('/', validateQuery(courseListSchema), courseController.getCourseList)

router.get('/search', validateQuery(searchSchema), courseController.searchCourses)

router.get('/:id', validateParams(courseIdSchema), courseController.getCourseDetail)

router.get('/:id/chapters', validateParams(courseIdSchema), courseController.getCourseChapters)

export default router
