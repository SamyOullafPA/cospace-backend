mysql -u root -p -e  "CREATE DATABASE cospace;"
mysql -u root -p cospace < migrations/001_init_schema.up.sql
mysql -u root -p cospace < migrations/002_add_indexing.up.sql
mysql -u root -p cospace < scripts/seed_and_queries.sql