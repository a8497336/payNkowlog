import { Order, Coupon } from '../models/index.js'
import { createWxPayOrder, verifyWxPayNotify } from '../utils/wechat.js'
import crypto from 'crypto'

export const initiateWxPay = async (req, res) => {
  try {
    const { order_id } = req.body
    const userId = req.user.id
    
    if (!order_id) {
      return res.status(400).json({
        code: 400,
        message: '缺少订单ID',
        data: null
      })
    }
    
    const order = await Order.findByPk(order_id)
    
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
    
    if (order.status !== 0) {
      return res.status(400).json({
        code: 400,
        message: '订单状态不正确',
        data: null
      })
    }
    
    const prepayId = `prepay_id_${order.order_no}_${Date.now()}`
    
    const payParams = await createWxPayOrder({
      prepay_id: prepayId
    })
    
    res.json({
      code: 200,
      message: 'success',
      data: payParams
    })
  } catch (error) {
    console.error('发起微信支付失败:', error)
    res.status(500).json({
      code: 500,
      message: '发起微信支付失败',
      data: null
    })
  }
}

export const wxPayCallback = async (req, res) => {
  try {
    const { return_code, result_code, out_trade_no, transaction_id } = req.body
    
    if (return_code !== 'SUCCESS' || result_code !== 'SUCCESS') {
      return res.send(`
        <xml>
          <return_code><![CDATA[FAIL]]></return_code>
          <return_msg><![CDATA[支付失败]]></return_msg>
        </xml>
      `)
    }
    
    const isValid = verifyWxPayNotify(req.body)
    if (!isValid) {
      return res.send(`
        <xml>
          <return_code><![CDATA[FAIL]]></return_code>
          <return_msg><![CDATA[签名验证失败]]></return_msg>
        </xml>
      `)
    }
    
    const order = await Order.findOne({
      where: { order_no: out_trade_no }
    })
    
    if (!order) {
      return res.send(`
        <xml>
          <return_code><![CDATA[FAIL]]></return_code>
          <return_msg><![CDATA[订单不存在]]></return_msg>
        </xml>
      `)
    }
    
    if (order.status === 1) {
      return res.send(`
        <xml>
          <return_code><![CDATA[SUCCESS]]></return_code>
          <return_msg><![CDATA[OK]]></return_msg>
        </xml>
      `)
    }
    
    order.status = 1
    order.pay_time = new Date()
    order.transaction_id = transaction_id
    await order.save()
    
    if (order.coupon_id) {
      const coupon = await Coupon.findByPk(order.coupon_id)
      if (coupon) {
        coupon.is_used = true
        coupon.used_time = new Date()
        coupon.order_id = order.id
        await coupon.save()
      }
    }
    
    res.send(`
      <xml>
        <return_code><![CDATA[SUCCESS]]></return_code>
        <return_msg><![CDATA[OK]]></return_msg>
      </xml>
    `)
  } catch (error) {
    console.error('微信支付回调处理失败:', error)
    res.send(`
      <xml>
        <return_code><![CDATA[FAIL]]></return_code>
        <return_msg><![CDATA[处理失败]]></return_msg>
      </xml>
    `)
  }
}

export const queryOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params
    const userId = req.user.id
    
    const order = await Order.findByPk(order_id)
    
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
      data: {
        order_id: order.id,
        order_no: order.order_no,
        status: order.status,
        pay_time: order.pay_time
      }
    })
  } catch (error) {
    console.error('查询订单状态失败:', error)
    res.status(500).json({
      code: 500,
      message: '查询订单状态失败',
      data: null
    })
  }
}
