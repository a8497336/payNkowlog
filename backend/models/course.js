import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '课程标题'
  },
  cover: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '封面图URL'
  },
  lecturer: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '讲师'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: '价格'
  },
  original_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '原价'
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '分类ID'
  },
  sales: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '销量'
  },
  intro: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '课程简介（富文本）'
  },
  is_free: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否免费'
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '状态 1上架 0下架'
  }
}, {
  tableName: 'courses',
  indexes: [
    {
      fields: ['category_id']
    },
    {
      fields: ['status']
    }
  ]
})

export default Course
