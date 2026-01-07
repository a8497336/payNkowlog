import request from '@/utils/request'

export function getHomeData() {
  return request({
    url: '/home',
    method: 'get'
  })
}

export function getCourseList(params) {
  return request({
    url: '/courses',
    method: 'get',
    params
  })
}

export function getCourseDetail(id) {
  return request({
    url: `/courses/${id}`,
    method: 'get'
  })
}

export function getCourseChapters(courseId) {
  return request({
    url: `/courses/${courseId}/chapters`,
    method: 'get'
  })
}
