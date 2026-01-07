import { Order, Course, Coupon, User } from '../models/index.js'
import { generateOrderNo } from '../utils/index.js'
import { createWxPayOrder } from '../utils/wechat.js'

export const createOrder = async (req, res) => {
  try {
    const { course_id, coupon_id } = req.body
    const userId = req.user.id
    
    if (!course_id) {
      return res.status(400).json({
        code: 400,
        message: '缺少课程ID',
        data: null
      })
    }
    
    const existingOrder = await Order.findOne({
      where: {
        user_id: userId,
        course_id: course_id,
        status: 1
      }
    })
    
    if (existingOrder) {
      return res.status(400).json({
        code: 400,
        message: '您已购买过该课程',
        data: null
      })
    }
    
    const course = await Course.findByPk(course_id)
    if (!course) {
      return res.status(404).json({
        code: 404,
        message: '课程不存在',
        data: null
      })
    }
    
    let amount = course.price
    let couponAmount = 0
    
    if (coupon_id) {
      const coupon = await Coupon.findOne({
        where: {
          id: coupon_id,
          user_id: userId,
          is_used: false
        }
      })
      
      if (!coupon) {
        return res.status(400).json({
          code: 400,
          message: '优惠券不存在或已使用',
          data: null
        })
      }
      
      if (coupon.min_amount > course.price) {
        return res.status(400).json({
          code: 400,
          message: `订单金额未满${coupon.min_amount}元，无法使用该优惠券`,
          data: null
        })
      }
      
      if (new Date(coupon.expire_time) < new Date()) {
        return res.status(400).json({
          code: 400,
          message: '优惠券已过期',
          data: null
        })
      }
      
      couponAmount = coupon.amount
      amount = Math.max(0, course.price - coupon.amount)
    }
    
    const order = await Order.create({
      order_no: generateOrderNo(),
      user_id: userId,
      course_id: course_id,
      amount: amount,
      original_amount: course.price,
      coupon_id: coupon_id || null,
      coupon_amount: couponAmount,
      status: 0
    })
    
    res.json({
      code: 200,
      message: '订单创建成功',
      data: {
        order_id: order.id,
        order_no: order.order_no,
        amount: order.amount
      }
    })
  } catch (error) {
    console.error('创建订单失败:', error)
    res.status(500).json({
      code: 500,
      message: '创建订单失败',
      data: null
    })
  }
}

export const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    
    const order = await Order.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'cover', 'price']
        },
        {
          model: Coupon,
          as: 'coupon',
          attributes: ['id', 'amount']
        }
      ]
    })
    
    if (!order) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在',
        data: null
      })
    }
    
    if (order.user_id !== userId) {
      return res.status(403).json({
        code: 403,
        message: '无权访问该订单',
        data: null
      })
    }
    
    res.json({
      code: 200,
      message: 'success',
      data: order
    })
  } catch (error) {
    console.error('获取订单详情失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取订单详情失败',
      data: null
    })
  }
}

export const getOrderList = async (req, res) => {
  try {
    const { status, page = 1, size = 10 } = req.query
    const userId = req.user.id
    
    const where = { user_id: userId }
    if (status !== undefined) {
      where.status = parseInt(status)
    }
    
    const offset = (page - 1) * size
    const limit = parseInt(size)
    
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'cover', 'price']
        }
      ],
      order: [['created_at', 'DESC']],
      offset,
      limit
    })
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        size: limit
      }
    })
  } catch (error) {
    console.error('获取订单列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取订单列表失败',
      data: null
    })
  }
}
