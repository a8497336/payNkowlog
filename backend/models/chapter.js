import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Chapter = sequelize.define('Chapter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '课程ID'
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '章节标题'
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '时长（秒）'
  },
  video_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '阿里云视频ID'
  },
  is_try: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否试看'
  },
  try_duration: {
    type: DataTypes.INTEGER,
    defaultValue: 180,
    comment: '试看时长（秒）'
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序'
  }
}, {
  tableName: 'chapters',
  indexes: [
    {
      fields: ['course_id']
    }
  ]
})

export default Chapter
