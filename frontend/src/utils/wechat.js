export const isWechat = () => {
  const ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('micromessenger') !== -1
}

export const getWechatCode = () => {
  return new Promise((resolve, reject) => {
    if (!isWechat()) {
      reject(new Error('请在微信中打开'))
      return
    }

    const appId = import.meta.env.VITE_WECHAT_APP_ID
    const redirectUri = encodeURIComponent(window.location.href)
    const scope = 'snsapi_userinfo'
    const state = 'STATE'

    const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`

    window.location.href = authUrl
  })
}

export const parseUrlParams = () => {
  const params = new URLSearchParams(window.location.search)
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

export const getWechatCodeFromUrl = () => {
  const params = parseUrlParams()
  return params.code
}
