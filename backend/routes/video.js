import express from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import Joi from 'joi'
import * as videoController from '../controllers/video.js'

const router = express.Router()

const getSignUrlSchema = Joi.object({
  video_id: Joi.string().required()
})

const saveProgressSchema = Joi.object({
  course_id: Joi.number().integer().positive().required(),
  chapter_id: Joi.number().integer().positive().required(),
  progress: Joi.number().integer().min(0).required()
})

router.post('/get-sign-url', authMiddleware, validate(getSignUrlSchema), videoController.getSignUrl)

router.post('/save-progress', authMiddleware, validate(saveProgressSchema), videoController.saveProgress)

router.get('/progress', authMiddleware, videoController.getProgress)

export default router
