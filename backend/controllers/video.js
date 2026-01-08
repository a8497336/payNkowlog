import { Chapter, Order, Progress } from '../models/index.js'
import { getVideoPlayAuth } from '../utils/aliyun.js'

export const getSignUrl = async (req, res) => {
  try {
    const { chapter_id, video_id } = req.body
    const userId = req.user?.id
    
    let chapter
    
    if (chapter_id) {
      chapter = await Chapter.findByPk(chapter_id)
    } else if (video_id) {
      chapter = await Chapter.findOne({ where: { video_id } })
    } else {
      return res.status(400).json({
        code: 400,
        message: '缺少章节ID或视频ID',
        data: null
      })
    }
    
    if (!chapter) {
      return res.status(404).json({
        code: 404,
        message: '章节不存在',
        data: null
      })
    }
    
    if (chapter.is_try) {
      const playAuth = await getVideoPlayAuth(chapter.video_id)
      
      res.json({
        code: 200,
        message: 'success',
        data: {
          url: playAuth,
          is_try: chapter.is_try,
          try_duration: chapter.try_duration
        }
      })
      return
    }
    
    if (!userId) {
      return res.status(401).json({
        code: 401,
        message: '请先登录',
        data: null
      })
    }
    
    const hasAccess = await checkCourseAccess(userId, chapter.course_id)
    
    if (!hasAccess) {
      return res.status(403).json({
        code: 403,
        message: '请先购买课程',
        data: null
      })
    }
    
    const playAuth = await getVideoPlayAuth(chapter.video_id)
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        url: playAuth,
        is_try: chapter.is_try,
        try_duration: chapter.try_duration
      }
    })
  } catch (error) {
    console.error('获取签名URL失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取签名URL失败',
      data: null
    })
  }
}

export const saveProgress = async (req, res) => {
  try {
    const { course_id, chapter_id, progress } = req.body
    const userId = req.user.id
    
    if (!course_id || !chapter_id || progress === undefined) {
      return res.status(400).json({
        code: 400,
        message: '缺少必要参数',
        data: null
      })
    }
    
    const chapter = await Chapter.findByPk(chapter_id)
    if (!chapter) {
      return res.status(404).json({
        code: 404,
        message: '章节不存在',
        data: null
      })
    }
    
    const isCompleted = progress >= chapter.duration
    
    const [progressRecord, created] = await Progress.findOrCreate({
      where: {
        user_id: userId,
        chapter_id: chapter_id
      },
      defaults: {
        user_id: userId,
        course_id: course_id,
        chapter_id: chapter_id,
        progress: progress,
        duration: chapter.duration,
        is_completed: isCompleted
      }
    })
    
    if (!created) {
      progressRecord.progress = progress
      progressRecord.duration = chapter.duration
      progressRecord.is_completed = isCompleted
      await progressRecord.save()
    }
    
    res.json({
      code: 200,
      message: '保存成功',
      data: null
    })
  } catch (error) {
    console.error('保存播放进度失败:', error)
    res.status(500).json({
      code: 500,
      message: '保存播放进度失败',
      data: null
    })
  }
}

const checkCourseAccess = async (userId, courseId) => {
  try {
    const order = await Order.findOne({
      where: {
        user_id: userId,
        course_id: courseId,
        status: 1
      }
    })
    
    return !!order
  } catch (error) {
    console.error('检查课程权限失败:', error)
    return false
  }
}

export const getProgress = async (req, res) => {
  try {
    const { course_id } = req.query
    const userId = req.user.id
    
    const where = { user_id: userId }
    if (course_id) {
      where.course_id = course_id
    }
    
    const progresses = await Progress.findAll({
      where,
      include: [
        {
          model: Chapter,
          as: 'chapter',
          attributes: ['id', 'title', 'duration']
        }
      ],
      order: [['updated_at', 'DESC']]
    })
    
    res.json({
      code: 200,
      message: 'success',
      data: progresses
    })
  } catch (error) {
    console.error('获取播放进度失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取播放进度失败',
      data: null
    })
  }
}
