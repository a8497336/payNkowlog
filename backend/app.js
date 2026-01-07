import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import sequelize from './config/database.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.text({ type: 'text/xml' }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '请求过于频繁，请稍后再试'
})

app.use('/api/', limiter)

import userRoutes from './routes/user.js'
import courseRoutes from './routes/course.js'
import videoRoutes from './routes/video.js'
import orderRoutes from './routes/order.js'
import payRoutes from './routes/pay.js'

app.use('/api/users', userRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/pay', payRoutes)

app.get('/api/home', async (req, res) => {
  try {
    const { Course, Category, Banner } = await import('./models/index.js')
    
    const banners = await Banner.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC']],
      limit: 5
    })

    const categories = await Category.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC']]
    })

    const courses = await Course.findAll({
      where: { status: 1 },
      order: [['sales', 'DESC'], ['created_at', 'DESC']],
      limit: 10
    })

    res.json({
      code: 200,
      message: 'success',
      data: {
        banners: banners.map(b => b.toJSON()),
        categories: categories.map(c => c.toJSON()),
        courses: courses.map(c => c.toJSON())
      }
    })
  } catch (error) {
    console.error('获取首页数据失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    })
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    data: null
  })
})

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('数据库连接成功')
    
    await sequelize.sync()
    console.log('数据库同步成功')
    
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('启动服务器失败:', error)
    process.exit(1)
  }
}

startServer()

export default app
