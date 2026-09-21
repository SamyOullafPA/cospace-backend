mysql -u root -p cospace < migrations/002_add_indexing.down.sql
mysql -u root -p cospace < migrations/001_init_schema.down.sql
mysql -u root -p -e  "DROP DATABASE cospace;"
