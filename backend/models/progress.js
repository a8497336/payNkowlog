import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Progress = sequelize.define('Progress', {
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
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '课程ID'
  },
  chapter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '章节ID'
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '播放进度（秒）'
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '视频总时长（秒）'
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否已完成'
  }
}, {
  tableName: 'progresses',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'chapter_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['course_id']
    }
  ]
})

export default Progress
