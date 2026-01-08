import request from '@/utils/request'

export function wxLogin(data) {
  return request({
    url: '/users/wxlogin',
    method: 'post',
    data
  })
}

export function usernameLogin(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/users/register',
    method: 'post',
    data
  })
}

export function getUserProfile() {
  return request({
    url: '/users/profile',
    method: 'get'
  })
}

export function getPurchasedCourses() {
  return request({
    url: '/users/purchased',
    method: 'get'
  })
}

export function getWatchHistory() {
  return request({
    url: '/users/history',
    method: 'get'
  })
}

export function checkCourseAccess(courseId) {
  return request({
    url: `/users/check-course/${courseId}`,
    method: 'get'
  })
}

export function getUserCoupons() {
  return request({
    url: '/users/coupons',
    method: 'get'
  })
}
