# Cospace Backend Repository

## Requirements
- MySQL 8.4.11
- A MySQL user with permission to create/alter tables in `cospace` database

## Setup
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
mysql -u root -p < scripts/seeds_and_queries.sql
```