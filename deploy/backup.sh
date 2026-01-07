#!/bin/bash

BACKUP_DIR="/var/backups/knowledge-payment"
DB_PATH="/var/www/knowledge-payment-backend/database.sqlite"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="database_${DATE}.sqlite"
RETENTION_DAYS=7

mkdir -p $BACKUP_DIR

cp $DB_PATH $BACKUP_DIR/$BACKUP_FILE

find $BACKUP_DIR -name "database_*.sqlite" -mtime +$RETENTION_DAYS -delete

echo "Database backup completed: $BACKUP_FILE"
echo "Old backups (older than $RETENTION_DAYS days) have been removed"
