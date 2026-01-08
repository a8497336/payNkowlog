import { User, Order, Course, Coupon, Progress, Chapter } from '../models/index.js'
import { generateToken } from '../config/jwt.js'
import { getWechatOpenid } from '../utils/wechat.js'
import { Op } from 'sequelize'
import crypto from 'crypto'

export const register = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空',
        data: null
      })
    }

    const existingUser = await User.findOne({ where: { nickname: username } })

    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: '用户名已存在',
        data: null
      })
    }

    const openid = crypto.randomBytes(32).toString('hex')

    const user = await User.create({
      openid,
      nickname: username,
      avatar: 'https://picsum.photos/100/100?random=' + Date.now(),
      member_level: 0
    })

    const token = generateToken({
      id: user.id,
      openid: user.openid
    })

    res.json({
      code: 200,
      message: '注册成功',
      data: {
        token,
        user: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          phone: user.phone,
          member_level: user.member_level
        }
      }
    })
  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).json({
      code: 500,
      message: error.message || '注册失败',
      data: null
    })
  }
}

export const wxLogin = async (req, res) => {
  try {
    const { code } = req.body
    
    if (!code) {
      return res.status(400).json({
        code: 400,
        message: '缺少授权码',
        data: null
      })
    }
    
    const openid = await getWechatOpenid(code)
    
    let user = await User.findOne({ where: { openid } })
    
    if (!user) {
      user = await User.create({
        openid,
        nickname: '微信用户',
        avatar: 'https://picsum.photos/100/100?random=100',
        member_level: 0
      })
    }
    
    const token = generateToken({
      id: user.id,
      openid: user.openid
    })
    
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          phone: user.phone,
          member_level: user.member_level
        }
      }
    })
  } catch (error) {
    console.error('微信登录失败:', error)
    res.status(500).json({
      code: 500,
      message: error.message || '登录失败',
      data: null
    })
  }
}

export const usernameLogin = async (req, res) => {
  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空',
        data: null
      })
    }
    
    let user = await User.findOne({ where: { nickname: username } })
    
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误',
        data: null
      })
    }
    
    const token = generateToken({
      id: user.id,
      openid: user.openid
    })
    
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          phone: user.phone,
          member_level: user.member_level
        }
      }
    })
  } catch (error) {
    console.error('用户名密码登录失败:', error)
    res.status(500).json({
      code: 500,
      message: error.message || '登录失败',
      data: null
    })
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      })
    }
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        member_level: user.member_level
      }
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取用户信息失败',
      data: null
    })
  }
}

export const updateUserProfile = async (req, res) => {
  try {
    const { nickname, avatar, phone } = req.body
    
    const user = await User.findByPk(req.user.id)
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      })
    }
    
    if (nickname) user.nickname = nickname
    if (avatar) user.avatar = avatar
    if (phone) user.phone = phone
    
    await user.save()
    
    res.json({
      code: 200,
      message: '更新成功',
      data: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        member_level: user.member_level
      }
    })
  } catch (error) {
    console.error('更新用户信息失败:', error)
    res.status(500).json({
      code: 500,
      message: '更新用户信息失败',
      data: null
    })
  }
}

export const getPurchasedCourses = async (req, res) => {
  try {
    const userId = req.user.id
    const { page = 1, size = 10 } = req.query
    
    const offset = (page - 1) * size
    const limit = parseInt(size)
    
    const { count, rows } = await Order.findAndCountAll({
      where: {
        user_id: userId,
        status: 1
      },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: Progress,
              as: 'progresses',
              where: { user_id: userId },
              required: false
            }
          ]
        }
      ],
      order: [['pay_time', 'DESC']],
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
    console.error('获取已购课程失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取已购课程失败',
      data: null
    })
  }
}

export const getWatchHistory = async (req, res) => {
  try {
    const userId = req.user.id
    const { page = 1, size = 10 } = req.query
    
    const offset = (page - 1) * size
    const limit = parseInt(size)
    
    const { count, rows } = await Progress.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'cover', 'lecturer']
        },
        {
          model: Chapter,
          as: 'chapter',
          attributes: ['id', 'title']
        }
      ],
      order: [['updated_at', 'DESC']],
      offset,
      limit,
      distinct: true
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
    console.error('获取观看历史失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取观看历史失败',
      data: null
    })
  }
}

export const getUserCoupons = async (req, res) => {
  try {
    const userId = req.user.id
    const { status, page = 1, size = 10 } = req.query
    
    const where = { user_id: userId }
    
    if (status === 'unused') {
      where.is_used = false
      where.expire_time = { [Op.gte]: new Date() }
    } else if (status === 'used') {
      where.is_used = true
    } else if (status === 'expired') {
      where.is_used = false
      where.expire_time = { [Op.lt]: new Date() }
    }
    
    const offset = (page - 1) * size
    const limit = parseInt(size)
    
    const { count, rows } = await Coupon.findAndCountAll({
      where,
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
    console.error('获取优惠券失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取优惠券失败',
      data: null
    })
  }
}

export const checkCourseAccess = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    
    const order = await Order.findOne({
      where: {
        user_id: userId,
        course_id: id,
        status: 1
      }
    })
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        hasAccess: !!order
      }
    })
  } catch (error) {
    console.error('检查课程权限失败:', error)
    res.status(500).json({
      code: 500,
      message: '检查课程权限失败',
      data: null
    })
  }
}
