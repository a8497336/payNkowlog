import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '订单号'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户ID'
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '课程ID'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '实付金额'
  },
  original_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '订单金额'
  },
  coupon_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '优惠券ID'
  },
  coupon_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: '优惠券抵扣金额'
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '状态 0待支付 1已支付 2已取消 3已退款'
  },
  pay_time: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '支付时间'
  },
  transaction_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '微信支付交易号'
  }
}, {
  tableName: 'orders',
  indexes: [
    {
      unique: true,
      fields: ['order_no']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['course_id']
    },
    {
      fields: ['status']
    }
  ]
})

export default Order
