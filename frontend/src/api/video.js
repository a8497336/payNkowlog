import request from '@/utils/request'

export function getSignUrl(data) {
  return request({
    url: '/videos/get-sign-url',
    method: 'post',
    data
  })
}

export function saveProgress(data) {
  return request({
    url: '/videos/save-progress',
    method: 'post',
    data
  })
}
