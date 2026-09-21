# Cospace Backend Repository

## Requirements
- MySQL 8.4.11
- A MySQL user with permission to create/alter tables in `cospace` database

## Setup

### Automatic Setup
An automatic setup can be completed by running this command in terminal `sh setup_database.sh`.

### Automatic Rollback
An automatic rollback can be completed by running this command in terminal `sh delete_database.sh`.

### Manual Setup
Create database via the command:
```SQL
CREATE DATABASE cospace;
```
Apply the migrations by running the commands:
```sh
mysql -u root -p cospace < migrations/001_init_schema.up.sql
mysql -u root -p cospace < migrations/002_add_indexing.up.sql
```
Seed the database by running the command
```sh
mysql -u root -p < scripts/seed_and_queries.sql
```

### Manual Rollback
```sh
mysql -u root -p cospace < migrations/002_add_indexing.down.sql
mysql -u root -p cospace < migrations/001_init_schema.down.sql
``` 