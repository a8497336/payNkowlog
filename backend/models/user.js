import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '微信唯一标识'
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '用户昵称'
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '头像URL'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '手机号'
  },
  member_level: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '会员等级 0普通 1VIP 2SVIP'
  }
}, {
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['openid']
    }
  ]
})

export default User
