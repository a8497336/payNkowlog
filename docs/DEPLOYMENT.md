# 知识付费视频 H5 全栈应用 - 部署文档

## 部署架构

```
┌─────────────────────────────────────────────────────────┐
│                     阿里云 ECS                      │
│  ┌──────────────────────────────────────────────┐   │
│  │              Nginx (443)                    │   │
│  │  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │  前端静态文件  │  │  反向代理        │   │   │
│  │  │  (OSS/CDN)   │  │  → 后端API      │   │   │
│  │  └──────────────┘  └──────────────────┘   │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │              PM2 进程守护                    │   │
│  │  ┌────────────────────────────────────┐    │   │
│  │  │  Node.js + Express (5000)        │    │   │
│  │  │  ┌────────────────────────────┐  │    │   │
│  │  │  │  SQLite 数据库            │  │    │   │
│  │  │  │  (database.sqlite)        │  │    │   │
│  │  │  └────────────────────────────┘  │    │   │
│  │  └────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 服务器环境要求

- **操作系统**: Ubuntu 20.04+ / CentOS 7+
- **Node.js**: >= 16.0.0
- **Nginx**: >= 1.18
- **PM2**: >= 4.5
- **内存**: >= 2GB
- **磁盘**: >= 20GB

## 部署步骤

### 1. 服务器基础环境配置

#### 1.1 安装 Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

node -v
npm -v
```

#### 1.2 安装 PM2
```bash
sudo npm install -g pm2
pm2 -v
```

#### 1.3 安装 Nginx
```bash
sudo apt update
sudo apt install -y nginx

nginx -v
```

#### 1.4 配置防火墙
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. 上传项目代码

#### 2.1 克隆或上传项目
```bash
cd /var/www
sudo mkdir -p knowledge-payment
sudo chown -R $USER:$USER /var/www/knowledge-payment
cd knowledge-payment

# 使用 git 克隆或上传项目文件
git clone https://github.com/your-repo/knowledge-payment.git .
# 或使用 scp 上传
# scp -r /local/path/* user@server:/var/www/knowledge-payment/
```

#### 2.2 安装后端依赖
```bash
cd /var/www/knowledge-payment/backend
npm install --production
```

#### 2.3 安装前端依赖并打包
```bash
cd /var/www/knowledge-payment/frontend
npm install
npm run build
```

### 3. 配置环境变量

#### 3.1 配置后端环境变量
```bash
cd /var/www/knowledge-payment/backend
cp .env.example .env
nano .env
```

修改以下配置：
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_strong_jwt_secret_key_here_change_in_production
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

#### 3.2 配置前端环境变量
```bash
cd /var/www/knowledge-payment/frontend
cp .env.production.example .env.production
nano .env.production
```

修改以下配置：
```env
VITE_APP_TITLE=知识付费视频H5
VITE_APP_ENV=production
VITE_APP_BASE_API=https://your-domain.com/api
VITE_APP_UPLOAD_URL=https://your-domain.com/api/upload
VITE_WECHAT_APP_ID=your_wechat_app_id
```

### 4. 数据库初始化

#### 4.1 初始化 SQLite 数据库
```bash
cd /var/www/knowledge-payment/backend
npm run init-db
```

#### 4.2 上传已有数据库（可选）
如果本地已有数据库文件：
```bash
scp /local/path/database.sqlite user@server:/var/www/knowledge-payment/backend/
```

### 5. 配置 PM2 进程守护

#### 5.1 启动后端服务
```bash
cd /var/www/knowledge-payment/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 5.2 查看 PM2 状态
```bash
pm2 status
pm2 logs knowledge-payment-backend
```

### 6. 配置 Nginx

#### 6.1 创建 Nginx 配置文件
```bash
sudo cp /var/www/knowledge-payment/deploy/nginx.conf /etc/nginx/sites-available/knowledge-payment
sudo nano /etc/nginx/sites-available/knowledge-payment
```

修改以下配置：
```nginx
server_name your-domain.com;
ssl_certificate /etc/nginx/ssl/your-domain.com.crt;
ssl_certificate_key /etc/nginx/ssl/your-domain.com.key;
root /var/www/knowledge-payment/frontend/dist;
```

#### 6.2 启用站点配置
```bash
sudo ln -sf /etc/nginx/sites-available/knowledge-payment /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. 配置 HTTPS 证书

#### 7.1 使用 Let's Encrypt 免费证书
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### 7.2 自动续期
```bash
sudo certbot renew --dry-run
sudo crontab -e
```

添加以下行：
```
0 3 * * * certbot renew --quiet && systemctl reload nginx
```

### 8. 配置数据库备份

#### 8.1 设置备份脚本
```bash
cd /var/www/knowledge-payment/backend
chmod +x /var/www/knowledge-payment/deploy/backup.sh
```

#### 8.2 配置定时备份
```bash
crontab -e
```

添加以下行（每天凌晨2点备份）：
```
0 2 * * * /var/www/knowledge-payment/deploy/backup.sh >> /var/backups/knowledge-payment/backup.log 2>&1
```

### 9. 配置阿里云服务

#### 9.1 配置阿里云 OSS
1. 登录阿里云控制台
2. 进入对象存储 OSS
3. 创建 Bucket，设置权限为私有读
4. 配置跨域规则（CORS）
5. 获取 Bucket 名称和区域信息

#### 9.2 配置阿里云视频点播
1. 登录阿里云控制台
2. 进入视频点播 VOD
3. 配置转码模板
4. 配置播放域名和 HTTPS
5. 获取 AccessKey ID 和 Secret

### 10. 配置微信支付

#### 10.1 微信公众号配置
1. 登录微信公众平台
2. 配置服务器地址（URL）
3. 配置 JS 接口安全域名
4. 配置网页授权域名
5. 获取 AppID 和 AppSecret

#### 10.2 微信支付配置
1. 登录微信支付商户平台
2. 配置 API 证书
3. 配置支付回调 URL
4. 获取商户号（MCH_ID）和 API 密钥

### 11. 前端部署到 OSS（可选）

#### 11.1 安装阿里云 OSS 上传工具
```bash
npm install -g ali-oss
```

#### 11.2 创建上传脚本
```bash
cd /var/www/knowledge-payment/frontend
nano upload-oss.js
```

```javascript
const OSS = require('ali-oss');
const path = require('path');
const fs = require('fs');

const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: 'your_access_key_id',
  accessKeySecret: 'your_access_key_secret',
  bucket: 'your-bucket-name'
});

const uploadDir = (dir, prefix = '') => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      uploadDir(filePath, `${prefix}${file}/`);
    } else {
      const objectKey = `${prefix}${file}`;
      client.put(objectKey, filePath);
      console.log(`Uploaded: ${objectKey}`);
    }
  });
};

uploadDir('./dist', 'h5/');
```

#### 11.3 执行上传
```bash
node upload-oss.js
```

### 12. 配置 CDN 加速（可选）

#### 12.1 在阿里云 CDN 控制台添加域名
1. 添加加速域名
2. 配置源站信息（OSS 或 ECS）
3. 配置缓存规则
4. 配置 HTTPS

#### 12.2 配置 CDN 回源
```nginx
location / {
    root /var/www/knowledge-payment/frontend/dist;
    try_files $uri $uri/ /index.html;
    
    add_header Cache-Control "public, max-age=3600";
}
```

## 监控与维护

### 查看 PM2 日志
```bash
pm2 logs knowledge-payment-backend
pm2 logs knowledge-payment-backend --lines 100
```

### 查看 Nginx 日志
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 重启服务
```bash
pm2 restart knowledge-payment-backend
sudo systemctl reload nginx
```

### 查看系统资源
```bash
pm2 monit
htop
df -h
```

## 性能优化

### 1. Nginx 优化
```nginx
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. PM2 优化
```javascript
{
  "instances": "max",
  "exec_mode": "cluster",
  "max_memory_restart": "1G"
}
```

### 3. 数据库优化
- 定期清理过期数据
- 添加索引
- 定期备份数据

## 安全加固

### 1. 防火墙配置
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
```

### 2. SSH 安全
```bash
sudo nano /etc/ssh/sshd_config
```

修改以下配置：
```
PermitRootLogin no
PasswordAuthentication no
```

### 3. 定期更新
```bash
sudo apt update
sudo apt upgrade
```

## 故障排查

### 后端服务无法启动
```bash
pm2 logs knowledge-payment-backend --err
netstat -tlnp | grep 5000
```

### Nginx 配置错误
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### 数据库连接失败
```bash
ls -la /var/www/knowledge-payment/backend/database.sqlite
chmod 644 /var/www/knowledge-payment/backend/database.sqlite
```

### 支付回调失败
```bash
sudo tail -f /var/log/nginx/access.log | grep wxpay
pm2 logs knowledge-payment-backend | grep wxpay
```

## 备份与恢复

### 备份数据库
```bash
cp /var/www/knowledge-payment/backend/database.sqlite /var/backups/knowledge-payment/database_$(date +%Y%m%d).sqlite
```

### 恢复数据库
```bash
cp /var/backups/knowledge-payment/database_20240101.sqlite /var/www/knowledge-payment/backend/database.sqlite
pm2 restart knowledge-payment-backend
```

### 备份配置文件
```bash
tar -czf /var/backups/knowledge-payment/config_$(date +%Y%m%d).tar.gz /var/www/knowledge-payment/backend/.env /etc/nginx/sites-available/knowledge-payment
```

## 常见问题

### Q: 如何更新代码？
A: 
```bash
cd /var/www/knowledge-payment
git pull
cd backend && npm install --production
cd ../frontend && npm install && npm run build
pm2 restart knowledge-payment-backend
sudo systemctl reload nginx
```

### Q: 如何查看实时日志？
A:
```bash
pm2 logs knowledge-payment-backend
sudo tail -f /var/log/nginx/access.log
```

### Q: 如何回滚版本？
A:
```bash
cd /var/www/knowledge-payment
git log
git checkout <commit-hash>
cd backend && npm install --production
cd ../frontend && npm install && npm run build
pm2 restart knowledge-payment-backend
```

### Q: 数据库文件损坏怎么办？
A:
```bash
cd /var/www/knowledge-payment/backend
cp /var/backups/knowledge-payment/database_latest.sqlite ./database.sqlite
pm2 restart knowledge-payment-backend
```

## 联系支持

如有问题，请联系技术支持：
- 邮箱: support@example.com
- 文档: https://docs.example.com
