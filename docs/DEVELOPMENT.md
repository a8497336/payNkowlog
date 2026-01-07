# 知识付费视频 H5 全栈应用 - 开发文档

## 项目简介

本项目是一套基于 Vue3 + Node.js + SQLite 的知识付费视频类 H5 全栈应用，支持微信登录、微信支付、视频防盗播放等核心功能。

## 技术栈

### 前端技术栈
- **基础框架**: Vue3 + Vite 4.x
- **UI 组件**: Vant UI 4.x
- **状态管理**: Pinia
- **路由管理**: Vue Router 4.x
- **视频播放**: video.js
- **网络请求**: Axios
- **适配方案**: postcss-px-to-viewport

### 后端技术栈
- **服务端框架**: Node.js + Express
- **数据库**: SQLite + Sequelize ORM
- **数据校验**: Joi
- **身份认证**: JWT
- **文件存储**: 阿里云 OSS
- **视频服务**: 阿里云视频点播
- **支付对接**: 微信 H5 支付

## 项目结构

### 前端项目结构
```
frontend/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口封装
│   │   ├── user.js        # 用户相关接口
│   │   ├── course.js      # 课程相关接口
│   │   ├── video.js       # 视频相关接口
│   │   └── order.js       # 订单相关接口
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   │   └── PayPopup.vue  # 支付弹窗组件
│   ├── router/            # 路由配置
│   │   └── index.js      # 路由定义
│   ├── stores/            # Pinia 状态管理
│   │   ├── user.js       # 用户模块
│   │   ├── course.js     # 课程模块
│   │   ├── play.js       # 播放模块
│   │   └── pay.js        # 支付模块
│   ├── utils/             # 工具函数
│   │   ├── request.js    # Axios 封装
│   │   ├── index.js      # 通用工具
│   │   └── wechat.js     # 微信工具
│   ├── views/             # 页面组件
│   │   ├── Home.vue      # 首页
│   │   ├── CourseDetail.vue  # 课程详情
│   │   ├── VideoPlay.vue     # 视频播放
│   │   └── Profile.vue      # 个人中心
│   ├── styles/            # 样式文件
│   │   └── index.scss    # 全局样式
│   ├── App.vue           # 根组件
│   └── main.js          # 入口文件
├── .env.development     # 开发环境配置
├── .env.test           # 测试环境配置
├── .env.production     # 生产环境配置
├── index.html          # HTML 模板
├── package.json        # 依赖配置
├── vite.config.js     # Vite 配置
└── postcss.config.js  # PostCSS 配置
```

### 后端项目结构
```
backend/
├── config/              # 配置文件
│   ├── database.js       # SQLite 配置
│   ├── jwt.js           # JWT 配置
│   └── aliyun.js        # 阿里云配置
├── controllers/         # 控制器层
│   ├── user.js          # 用户控制器
│   ├── course.js        # 课程控制器
│   ├── video.js         # 视频控制器
│   ├── order.js         # 订单控制器
│   └── pay.js          # 支付控制器
├── models/             # 数据模型层
│   ├── user.js          # 用户模型
│   ├── category.js      # 分类模型
│   ├── banner.js        # 轮播图模型
│   ├── course.js        # 课程模型
│   ├── chapter.js       # 章节模型
│   ├── order.js         # 订单模型
│   ├── progress.js      # 播放进度模型
│   ├── coupon.js        # 优惠券模型
│   └── index.js        # 模型索引
├── routes/             # 路由层
│   ├── user.js          # 用户路由
│   ├── course.js        # 课程路由
│   ├── video.js         # 视频路由
│   ├── order.js         # 订单路由
│   └── pay.js          # 支付路由
├── middlewares/        # 中间件
│   ├── auth.js          # JWT 认证中间件
│   └── validate.js      # 参数校验中间件
├── utils/              # 工具函数
│   ├── index.js         # 通用工具
│   ├── aliyun.js        # 阿里云工具
│   └── wechat.js        # 微信工具
├── scripts/            # 脚本文件
│   └── initDatabase.js # 数据库初始化脚本
├── .env               # 环境变量
├── app.js             # Express 入口文件
├── package.json        # 依赖配置
├── ecosystem.config.js # PM2 配置
└── database.sqlite    # SQLite 数据库文件
```

## 本地开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 前端开发

1. 安装依赖
```bash
cd frontend
npm install
```

2. 配置环境变量
复制 `.env.development` 并修改相关配置：
```env
VITE_APP_TITLE=知识付费视频H5
VITE_APP_ENV=development
VITE_APP_BASE_API=/api
VITE_APP_UPLOAD_URL=http://localhost:5000/api/upload
VITE_WECHAT_APP_ID=your_wechat_app_id
```

3. 启动开发服务器
```bash
npm run dev
```

前端服务将运行在 `http://localhost:3000`

### 后端开发

1. 安装依赖
```bash
cd backend
npm install
```

2. 配置环境变量
复制 `.env` 并修改相关配置：
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
DB_PATH=./database.sqlite
ALIYUN_ACCESS_KEY_ID=your_aliyun_access_key_id
ALIYUN_ACCESS_KEY_SECRET=your_aliyun_access_key_secret
ALIYUN_OSS_REGION=oss-cn-hangzhou
ALIYUN_OSS_BUCKET=your-bucket-name
ALIYUN_VOD_REGION=cn-hangzhou
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret
WECHAT_MCH_ID=your_wechat_mch_id
WECHAT_API_KEY=your_wechat_api_key
WECHAT_NOTIFY_URL=https://your-domain.com/api/pay/wxpay/callback
```

3. 初始化数据库
```bash
npm run init-db
```

4. 启动开发服务器
```bash
npm run dev
```

后端服务将运行在 `http://localhost:5000`

## 接口文档

### 用户模块

#### 微信登录
- **接口**: `POST /api/users/wxlogin`
- **参数**: 
  - `code` (string, 必填): 微信授权码
- **返回**:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "jwt_token_here",
      "user": {
        "id": 1,
        "nickname": "微信用户",
        "avatar": "avatar_url",
        "phone": null,
        "member_level": 0
      }
    }
  }
  ```

#### 获取用户信息
- **接口**: `GET /api/users/profile`
- **请求头**: `Authorization: Bearer {token}`
- **返回**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "nickname": "微信用户",
      "avatar": "avatar_url",
      "phone": null,
      "member_level": 0
    }
  }
  ```

### 课程模块

#### 获取首页数据
- **接口**: `GET /api/home`
- **返回**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "banners": [...],
      "categories": [...],
      "courses": [...]
    }
  }
  ```

#### 获取课程列表
- **接口**: `GET /api/courses`
- **参数**:
  - `category_id` (number, 可选): 分类ID
  - `sort` (string, 可选): 排序方式 (sales/price_asc/price_desc)
  - `page` (number, 可选): 页码，默认1
  - `size` (number, 可选): 每页数量，默认10
- **返回**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "list": [...],
      "total": 100,
      "page": 1,
      "size": 10
    }
  }
  ```

#### 获取课程详情
- **接口**: `GET /api/courses/:id`
- **返回**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "title": "课程标题",
      "cover": "cover_url",
      "lecturer": "讲师",
      "price": 199.00,
      "original_price": 299.00,
      "sales": 1234,
      "intro": "课程简介",
      "chapters": [...]
    }
  }
  ```

### 视频模块

#### 获取签名播放URL
- **接口**: `POST /api/videos/get-sign-url`
- **请求头**: `Authorization: Bearer {token}`
- **参数**:
  - `video_id` (string, 必填): 视频ID
- **返回**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "url": "signed_video_url",
      "is_try": false,
      "try_duration": 180
    }
  }
  ```

#### 保存播放进度
- **接口**: `POST /api/videos/save-progress`
- **请求头**: `Authorization: Bearer {token}`
- **参数**:
  - `course_id` (number, 必填): 课程ID
  - `chapter_id` (number, 必填): 章节ID
  - `progress` (number, 必填): 播放进度（秒）
- **返回**:
  ```json
  {
    "code": 200,
    "message": "保存成功",
    "data": null
  }
  ```

### 支付模块

#### 创建订单
- **接口**: `POST /api/orders/create`
- **请求头**: `Authorization: Bearer {token}`
- **参数**:
  - `course_id` (number, 必填): 课程ID
  - `coupon_id` (number, 可选): 优惠券ID
- **返回**:
  ```json
  {
    "code": 200,
    "message": "订单创建成功",
    "data": {
      "order_id": 1,
      "order_no": "ORD1234567890ABCDEF",
      "amount": 179.00
    }
  }
  ```

#### 发起微信支付
- **接口**: `POST /api/pay/wxpay`
- **请求头**: `Authorization: Bearer {token}`
- **参数**:
  - `order_id` (number, 必填): 订单ID
- **返回**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "appId": "wx1234567890abcdef",
      "timeStamp": "1234567890",
      "nonceStr": "abc123",
      "package": "prepay_id=wx1234567890",
      "signType": "MD5",
      "paySign": "sign_here"
    }
  }
  ```

## 核心功能说明

### 微信登录流程
1. 前端调用微信 JS-SDK 获取 `code`
2. 将 `code` 传给后端 `/api/users/wxlogin` 接口
3. 后端通过 `code` 调用微信官方接口获取 `openid`
4. 查询或创建用户，生成 JWT token 返回前端
5. 前端存储 token 并携带到后续请求

### 视频防盗播放方案
1. 后端基于阿里云视频点播生成临时签名播放 URL（过期时间30分钟）
2. 前端每次播放前必须调用接口获取，禁止直接暴露视频源
3. 播放时添加用户昵称动态水印
4. 监听浏览器截屏事件并弹出提示
5. 禁用视频右键菜单

### 微信 H5 支付闭环
1. 前端创建订单 → 调用支付接口获取参数
2. 唤起微信支付 → 支付完成后跳转到回调页
3. 后端接收微信支付异步回调 → 验证签名合法性
4. 更新订单状态为已支付 → 完成用户课程购买权限关联

### SQLite 本地开发与生产部署
1. 本地开发：Sequelize 自动创建 `database.sqlite` 文件，无需配置服务
2. 生产部署：将本地 `database.sqlite` 文件上传至服务器
3. 配置 PM2 重启时不删除数据文件
4. 添加定时任务备份数据

## 常见问题

### 微信授权失败
- 检查微信 AppID 和 AppSecret 是否正确配置
- 确认授权域名已在微信公众平台配置
- 检查授权回调 URL 是否正确

### 视频无法播放
- 检查阿里云视频点播配置是否正确
- 确认视频 ID 是否有效
- 检查签名 URL 是否过期

### 跨域报错
- 检查后端 CORS 配置
- 确认前端 API 地址配置正确
- 检查 Nginx 反向代理配置

### 支付失败
- 检查微信商户配置是否正确
- 确认支付回调 URL 是否可访问
- 检查订单金额是否正确
