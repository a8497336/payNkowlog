import axios from 'axios'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useUserStore } from '@/stores/user'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 30000
})

service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 200) {
      showToast({
        message: res.message || '请求失败',
        position: 'top'
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error) => {
    closeToast()
    if (error.response) {
      switch (error.response.status) {
        case 401:
          showToast({
            message: '登录已过期，请重新登录',
            position: 'top'
          })
          const userStore = useUserStore()
          userStore.logout()
          window.location.href = '/'
          break
        case 403:
          showToast({
            message: '没有权限访问',
            position: 'top'
          })
          break
        case 404:
          showToast({
            message: '请求的资源不存在',
            position: 'top'
          })
          break
        case 500:
          showToast({
            message: '服务器错误',
            position: 'top'
          })
          break
        default:
          showToast({
            message: error.response.data.message || '网络错误',
            position: 'top'
          })
      }
    } else {
      showToast({
        message: '网络连接失败',
        position: 'top'
      })
    }
    return Promise.reject(error)
  }
)

export default service
