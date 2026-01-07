import sequelize from '../config/database.js'
import { User, Category, Banner, Course, Chapter, Order, Progress, Coupon } from '../models/index.js'
import { generateOrderNo } from '../utils/index.js'

const initDatabase = async () => {
  try {
    console.log('开始初始化数据库...')
    
    await sequelize.sync({ force: true })
    console.log('数据库表创建成功')
    
    const categories = await Category.bulkCreate([
      { name: '前端开发', icon: 'code-o', sort: 1 },
      { name: '后端开发', icon: 'cluster-o', sort: 2 },
      { name: '移动开发', icon: 'phone-o', sort: 3 },
      { name: '人工智能', icon: 'aim', sort: 4 },
      { name: '产品设计', icon: 'bulb-o', sort: 5 }
    ])
    console.log('分类数据创建成功')
    
    const banners = await Banner.bulkCreate([
      {
        title: 'Vue3全栈开发实战',
        image: 'https://picsum.photos/750/300?random=1',
        link: '/course/1',
        sort: 1
      },
      {
        title: 'Node.js后端开发',
        image: 'https://picsum.photos/750/300?random=2',
        link: '/course/2',
        sort: 2
      },
      {
        title: '微信小程序开发',
        image: 'https://picsum.photos/750/300?random=3',
        link: '/course/3',
        sort: 3
      }
    ])
    console.log('轮播图数据创建成功')
    
    const courses = await Course.bulkCreate([
      {
        title: 'Vue3 + Vite 全栈开发实战',
        cover: 'https://picsum.photos/400/300?random=10',
        lecturer: '张三',
        price: 199.00,
        original_price: 299.00,
        category_id: categories[0].id,
        sales: 1234,
        intro: '<p>本课程从零开始，带你掌握Vue3 + Vite全栈开发技术栈。</p>',
        is_free: false
      },
      {
        title: 'Node.js + Express 后端开发',
        cover: 'https://picsum.photos/400/300?random=11',
        lecturer: '李四',
        price: 149.00,
        original_price: 199.00,
        category_id: categories[1].id,
        sales: 856,
        intro: '<p>深入学习Node.js后端开发，掌握Express框架和数据库操作。</p>',
        is_free: false
      },
      {
        title: '微信小程序开发入门',
        cover: 'https://picsum.photos/400/300?random=12',
        lecturer: '王五',
        price: 99.00,
        original_price: 149.00,
        category_id: categories[2].id,
        sales: 2345,
        intro: '<p>从零开始学习微信小程序开发，快速上手实战项目。</p>',
        is_free: false
      },
      {
        title: 'React Native 移动开发',
        cover: 'https://picsum.photos/400/300?random=13',
        lecturer: '赵六',
        price: 179.00,
        original_price: 249.00,
        category_id: categories[2].id,
        sales: 567,
        intro: '<p>使用React Native开发跨平台移动应用，一套代码多端运行。</p>',
        is_free: false
      },
      {
        title: 'Python 人工智能入门',
        cover: 'https://picsum.photos/400/300?random=14',
        lecturer: '钱七',
        price: 299.00,
        original_price: 399.00,
        category_id: categories[3].id,
        sales: 1890,
        intro: '<p>Python人工智能入门课程，掌握机器学习和深度学习基础。</p>',
        is_free: false
      },
      {
        title: 'UI/UX 设计实战',
        cover: 'https://picsum.photos/400/300?random=15',
        lecturer: '孙八',
        price: 129.00,
        original_price: 179.00,
        category_id: categories[4].id,
        sales: 432,
        intro: '<p>学习UI/UX设计原理，掌握Figma等设计工具的使用。</p>',
        is_free: false
      }
    ])
    console.log('课程数据创建成功')
    
    const chapters = []
    courses.forEach((course, courseIndex) => {
      for (let i = 1; i <= 10; i++) {
        chapters.push({
          course_id: course.id,
          title: `第${i}节：课程内容讲解`,
          duration: 600 + Math.floor(Math.random() * 600),
          video_id: `video_${course.id}_${i}`,
          is_try: i === 1,
          try_duration: 180,
          sort: i
        })
      }
    })
    await Chapter.bulkCreate(chapters)
    console.log('章节数据创建成功')
    
    const testUser = await User.create({
      openid: 'test_openid_123456',
      nickname: '测试用户',
      avatar: 'https://picsum.photos/100/100?random=100',
      phone: '13800138000',
      member_level: 1
    })
    console.log('测试用户创建成功')
    
    const now = new Date()
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    await Coupon.bulkCreate([
      {
        user_id: testUser.id,
        amount: 20.00,
        min_amount: 100.00,
        expire_time: futureDate,
        is_used: false
      },
      {
        user_id: testUser.id,
        amount: 50.00,
        min_amount: 200.00,
        expire_time: futureDate,
        is_used: false
      }
    ])
    console.log('优惠券数据创建成功')
    
    const testOrder = await Order.create({
      order_no: generateOrderNo(),
      user_id: testUser.id,
      course_id: courses[0].id,
      amount: 179.00,
      original_amount: 199.00,
      coupon_id: 1,
      coupon_amount: 20.00,
      status: 1,
      pay_time: new Date(),
      transaction_id: 'wx_transaction_id_123456'
    })
    console.log('测试订单创建成功')
    
    await Progress.bulkCreate([
      {
        user_id: testUser.id,
        course_id: courses[0].id,
        chapter_id: chapters[0].id,
        progress: 300,
        duration: 600,
        is_completed: false
      },
      {
        user_id: testUser.id,
        course_id: courses[0].id,
        chapter_id: chapters[1].id,
        progress: 600,
        duration: 600,
        is_completed: true
      }
    ])
    console.log('播放进度数据创建成功')
    
    console.log('数据库初始化完成！')
    process.exit(0)
  } catch (error) {
    console.error('数据库初始化失败:', error)
    process.exit(1)
  }
}

initDatabase()
