import crypto from 'crypto'
import axios from 'axios'
import { wechatConfig } from '../config/aliyun.js'

export const getWechatAccessToken = async () => {
  try {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wechatConfig.appId}&secret=${wechatConfig.appSecret}`
    const response = await axios.get(url)
    return response.data.access_token
  } catch (error) {
    console.error('获取微信access_token失败:', error)
    throw new Error('获取微信access_token失败')
  }
}

export const getWechatOpenid = async (code) => {
  try {
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${wechatConfig.appId}&secret=${wechatConfig.appSecret}&code=${code}&grant_type=authorization_code`
    const response = await axios.get(url)
    return response.data.openid
  } catch (error) {
    console.error('获取微信openid失败:', error)
    throw new Error('获取微信openid失败')
  }
}

export const generateWxPaySign = (params) => {
  const sortedKeys = Object.keys(params).sort()
  const stringA = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&')
  const stringSignTemp = `${stringA}&key=${wechatConfig.apiKey}`
  return crypto.createHash('md5').update(stringSignTemp, 'utf8').digest('hex').toUpperCase()
}

export const createWxPayOrder = async (orderData) => {
  try {
    const nonceStr = crypto.randomBytes(16).toString('hex')
    const timestamp = Math.floor(Date.now() / 1000)
    
    const params = {
      appId: wechatConfig.appId,
      timeStamp: timestamp.toString(),
      nonceStr: nonceStr,
      package: `prepay_id=${orderData.prepay_id}`,
      signType: 'MD5'
    }
    
    params.paySign = generateWxPaySign(params)
    
    return params
  } catch (error) {
    console.error('创建微信支付订单失败:', error)
    throw new Error('创建微信支付订单失败')
  }
}

export const verifyWxPayNotify = (params) => {
  const sign = params.sign
  delete params.sign
  
  const generatedSign = generateWxPaySign(params)
  
  return sign === generatedSign
}

export default {
  getWechatAccessToken,
  getWechatOpenid,
  generateWxPaySign,
  createWxPayOrder,
  verifyWxPayNotify
}
