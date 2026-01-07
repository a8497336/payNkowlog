import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户ID'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '抵扣金额'
  },
  min_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: '使用门槛'
  },
  expire_time: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '过期时间'
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否已使用'
  },
  used_time: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '使用时间'
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '使用的订单ID'
  }
}, {
  tableName: 'coupons',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['is_used']
    },
    {
      fields: ['expire_time']
    }
  ]
})

export default Coupon
