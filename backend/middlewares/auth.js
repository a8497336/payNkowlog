import { verifyToken } from '../config/jwt.js'

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '未提供认证令牌',
      data: null
    })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({
      code: 401,
      message: '认证令牌无效或已过期',
      data: null
    })
  }

  req.user = decoded
  next()
}
