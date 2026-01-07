import request from '@/utils/request'

export function createOrder(data) {
  return request({
    url: '/orders/create',
    method: 'post',
    data
  })
}

export function getOrderDetail(orderId) {
  return request({
    url: `/orders/${orderId}`,
    method: 'get'
  })
}

export function initiateWxPay(data) {
  return request({
    url: '/pay/wxpay',
    method: 'post',
    data
  })
}
