import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cookies from 'js-cookie'

export const useUserStore = defineStore('user', () => {
  const token = ref(Cookies.get('token') || '')
  const userInfo = ref(null)
  const isLogin = ref(!!token.value)

  const setToken = (newToken) => {
    token.value = newToken
    isLogin.value = !!newToken
    if (newToken) {
      Cookies.set('token', newToken, { expires: 7 })
    } else {
      Cookies.remove('token')
    }
  }

  const setUserInfo = (info) => {
    userInfo.value = info
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    isLogin.value = false
    Cookies.remove('token')
  }

  return {
    token,
    userInfo,
    isLogin,
    setToken,
    setUserInfo,
    logout
  }
})
