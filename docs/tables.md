## Creating the users table
```SQL
CREATE TABLE Users (
    ID int,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    age int NOT NULL,
    active boolean NOT NULL
)
```

When running `DESCRIBE Users;`, this displays the following: 

```
+--------+------------+------+-----+---------+-------+
| Field  | Type       | Null | Key | Default | Extra |
+--------+------------+------+-----+---------+-------+
| ID     | int        | YES  |     | NULL    |       |
| name   | text       | NO   |     | NULL    |       |
| email  | text       | NO   |     | NULL    |       |
| age    | int        | NO   |     | NULL    |       |
| active | tinyint(1) | NO   |     | NULL    |       |
+--------+------------+------+-----+---------+-------+
5 rows in set (0.00 sec)
```

Due to the fact that we set all of the attributes to be `NOT NULL`, when inserting a null value for an attribute, it will error, like so:

`ERROR 1364 (HY000): Field 'email' doesn't have a default value`