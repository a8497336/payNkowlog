import { Course, Chapter } from '../models/index.js'
import { Op } from 'sequelize'

export const getCourseList = async (req, res) => {
  try {
    const { category_id, sort, page = 1, size = 10 } = req.query
    
    const where = { status: 1 }
    if (category_id) {
      where.category_id = category_id
    }
    
    let order = [['created_at', 'DESC']]
    if (sort === 'sales') {
      order = [['sales', 'DESC']]
    } else if (sort === 'price_asc') {
      order = [['price', 'ASC']]
    } else if (sort === 'price_desc') {
      order = [['price', 'DESC']]
    }
    
    const offset = (page - 1) * size
    const limit = parseInt(size)
    
    const { count, rows } = await Course.findAndCountAll({
      where,
      order,
      offset,
      limit,
      include: [
        {
          model: Chapter,
          as: 'chapters',
          attributes: ['id']
        }
      ]
    })
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        size: limit
      }
    })
  } catch (error) {
    console.error('获取课程列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取课程列表失败',
      data: null
    })
  }
}

export const getCourseDetail = async (req, res) => {
  try {
    const { id } = req.params
    
    const course = await Course.findByPk(id, {
      include: [
        {
          model: Chapter,
          as: 'chapters',
          order: [['sort', 'ASC']]
        }
      ]
    })
    
    if (!course) {
      return res.status(404).json({
        code: 404,
        message: '课程不存在',
        data: null
      })
    }
    
    res.json({
      code: 200,
      message: 'success',
      data: course
    })
  } catch (error) {
    console.error('获取课程详情失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取课程详情失败',
      data: null
    })
  }
}

export const getCourseChapters = async (req, res) => {
  try {
    const { id } = req.params
    
    const chapters = await Chapter.findAll({
      where: { course_id: id },
      order: [['sort', 'ASC']]
    })
    
    res.json({
      code: 200,
      message: 'success',
      data: chapters
    })
  } catch (error) {
    console.error('获取章节列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取章节列表失败',
      data: null
    })
  }
}

export const searchCourses = async (req, res) => {
  try {
    const { keyword, page = 1, size = 10 } = req.query
    
    if (!keyword) {
      return res.status(400).json({
        code: 400,
        message: '缺少搜索关键词',
        data: null
      })
    }
    
    const where = {
      status: 1,
      [Op.or]: [
        { title: { [Op.like]: `%${keyword}%` } },
        { lecturer: { [Op.like]: `%${keyword}%` } },
        { intro: { [Op.like]: `%${keyword}%` } }
      ]
    }
    
    const offset = (page - 1) * size
    const limit = parseInt(size)
    
    const { count, rows } = await Course.findAndCountAll({
      where,
      order: [['sales', 'DESC'], ['created_at', 'DESC']],
      offset,
      limit
    })
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        size: limit
      }
    })
  } catch (error) {
    console.error('搜索课程失败:', error)
    res.status(500).json({
      code: 500,
      message: '搜索课程失败',
      data: null
    })
  }
}
