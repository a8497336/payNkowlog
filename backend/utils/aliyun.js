import OSS from 'ali-oss'
import { aliyunConfig } from '../config/aliyun.js'

const ossClient = new OSS({
  region: aliyunConfig.oss.region,
  accessKeyId: aliyunConfig.accessKeyId,
  accessKeySecret: aliyunConfig.accessKeySecret,
  bucket: aliyunConfig.oss.bucket
})

export const uploadFile = async (file, folder = 'uploads') => {
  try {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`
    const result = await ossClient.put(fileName, file.buffer)
    return {
      url: result.url,
      name: fileName
    }
  } catch (error) {
    console.error('OSS上传失败:', error)
    throw new Error('文件上传失败')
  }
}

export const deleteFile = async (fileName) => {
  try {
    await ossClient.delete(fileName)
    return true
  } catch (error) {
    console.error('OSS删除失败:', error)
    throw new Error('文件删除失败')
  }
}

export const getVideoPlayAuth = async (videoId) => {
  try {
    return `https://example.com/video/${videoId}?token=${Date.now()}`
  } catch (error) {
    console.error('获取视频播放凭证失败:', error)
    throw new Error('获取视频播放凭证失败')
  }
}

export const getVideoPlayInfo = async (videoId) => {
  try {
    return {
      videoId: videoId,
      title: '测试视频',
      duration: 600
    }
  } catch (error) {
    console.error('获取视频信息失败:', error)
    throw new Error('获取视频信息失败')
  }
}

export const createUploadVideo = async (title, fileName) => {
  try {
    return {
      uploadAddress: 'https://example.com/upload',
      videoId: `video_${Date.now()}`
    }
  } catch (error) {
    console.error('创建上传视频凭证失败:', error)
    throw new Error('创建上传视频凭证失败')
  }
}

export default {
  uploadFile,
  deleteFile,
  getVideoPlayAuth,
  getVideoPlayInfo,
  createUploadVideo
}
