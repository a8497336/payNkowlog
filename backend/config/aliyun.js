import dotenv from 'dotenv'

dotenv.config()

export const aliyunConfig = {
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
  oss: {
    region: process.env.ALIYUN_OSS_REGION,
    bucket: process.env.ALIYUN_OSS_BUCKET
  },
  vod: {
    region: process.env.ALIYUN_VOD_REGION || 'cn-hangzhou'
  }
}

export const wechatConfig = {
  appId: process.env.WECHAT_APP_ID,
  appSecret: process.env.WECHAT_APP_SECRET,
  mchId: process.env.WECHAT_MCH_ID,
  apiKey: process.env.WECHAT_API_KEY,
  notifyUrl: process.env.WECHAT_NOTIFY_URL
}
