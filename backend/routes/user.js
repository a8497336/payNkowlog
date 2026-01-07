import express from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import Joi from 'joi'
import * as userController from '../controllers/user.js'

const router = express.Router()

const wxLoginSchema = Joi.object({
  code: Joi.string().required()
})

const usernameLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

const updateProfileSchema = Joi.object({
  nickname: Joi.string().max(50).optional(),
  avatar: Joi.string().uri().optional(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).optional()
})

router.post('/wxlogin', validate(wxLoginSchema), userController.wxLogin)

router.post('/login', validate(usernameLoginSchema), userController.usernameLogin)

router.get('/profile', authMiddleware, userController.getUserProfile)

router.put('/profile', authMiddleware, validate(updateProfileSchema), userController.updateUserProfile)

router.get('/purchased', authMiddleware, userController.getPurchasedCourses)

router.get('/history', authMiddleware, userController.getWatchHistory)

router.get('/coupons', authMiddleware, userController.getUserCoupons)

router.get('/check-course/:id', authMiddleware, userController.checkCourseAccess)

export default router
