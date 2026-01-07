import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '轮播图标题'
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '图片URL'
  },
  link: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '跳转链接'
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序'
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '状态 1启用 0禁用'
  }
}, {
  tableName: 'banners'
})

export default Banner
