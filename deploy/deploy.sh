#!/bin/bash

set -e

echo "开始部署知识付费视频H5全栈应用..."

FRONTEND_DIR="/var/www/knowledge-payment-frontend"
BACKEND_DIR="/var/www/knowledge-payment-backend"
NGINX_CONF="/etc/nginx/sites-available/knowledge-payment"
BACKUP_SCRIPT="/var/www/knowledge-payment-backend/backup.sh"

echo "1. 安装依赖..."
cd $BACKEND_DIR
npm install --production

echo "2. 初始化数据库..."
if [ ! -f "$BACKEND_DIR/database.sqlite" ]; then
    npm run init-db
fi

echo "3. 配置备份脚本..."
chmod +x $BACKUP_SCRIPT
(crontab -l 2>/dev/null; echo "0 2 * * * $BACKUP_SCRIPT") | crontab -

echo "4. 重启后端服务..."
pm2 restart knowledge-payment-backend || pm2 start ecosystem.config.js

echo "5. 配置Nginx..."
sudo cp deploy/nginx.conf $NGINX_CONF
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "6. 设置定时备份..."
chmod +x $BACKUP_SCRIPT

echo "部署完成！"
echo "前端访问地址: https://your-domain.com"
echo "后端API地址: https://your-domain.com/api"
echo "数据库备份已配置，每天凌晨2点自动备份"
