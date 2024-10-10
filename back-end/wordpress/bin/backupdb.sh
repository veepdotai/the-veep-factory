#:/bin/bash

SERVER_NAME=$1
DB_NAME=$2

DATE=$(date "+%Y%m%d-%H%M%S")
SQL_DUMP="$SERVER_NAME-$DB_NAME $DATE.sql"

echo mysqldump --default-character-set=utf8mb4 -u root -p $DB_NAME \> $SQL_DUMP
mysqldump --default-character-set=utf8mb4 -u root -p $DB_NAME > $SQL_DUMP
