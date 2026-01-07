import sequelize from '../config/database.js'
import User from './user.js'
import Category from './category.js'
import Banner from './banner.js'
import Course from './course.js'
import Chapter from './chapter.js'
import Order from './order.js'
import Progress from './progress.js'
import Coupon from './coupon.js'

Category.hasMany(Course, { foreignKey: 'category_id', as: 'courses' })
Course.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

Course.hasMany(Chapter, { foreignKey: 'course_id', as: 'chapters' })
Chapter.belongsTo(Course, { foreignKey: 'course_id', as: 'course' })

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' })
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

Course.hasMany(Order, { foreignKey: 'course_id', as: 'orders' })
Order.belongsTo(Course, { foreignKey: 'course_id', as: 'course' })

User.hasMany(Progress, { foreignKey: 'user_id', as: 'progresses' })
Progress.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

Course.hasMany(Progress, { foreignKey: 'course_id', as: 'progresses' })
Progress.belongsTo(Course, { foreignKey: 'course_id', as: 'course' })

Chapter.hasMany(Progress, { foreignKey: 'chapter_id', as: 'progresses' })
Progress.belongsTo(Chapter, { foreignKey: 'chapter_id', as: 'chapter' })

User.hasMany(Coupon, { foreignKey: 'user_id', as: 'coupons' })
Coupon.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

Order.belongsTo(Coupon, { foreignKey: 'coupon_id', as: 'coupon' })

export {
  sequelize,
  User,
  Category,
  Banner,
  Course,
  Chapter,
  Order,
  Progress,
  Coupon
}
