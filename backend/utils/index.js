import crypto from 'crypto'

export const generateOrderNo = () => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8)
  return `ORD${timestamp}${random}`.toUpperCase()
}

export const md5 = (str) => {
  return crypto.createHash('md5').update(str).digest('hex')
}

export const formatResponse = (code = 200, message = 'success', data = null) => {
  return {
    code,
    message,
    data
  }
}

export const formatError = (message = '操作失败', code = 500) => {
  return {
    code,
    message,
    data: null
  }
}
