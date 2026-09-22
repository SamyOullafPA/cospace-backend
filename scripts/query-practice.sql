CREATE DATABASE sandbox;
USE sandbox;

CREATE TABLE departments (
  id   INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(100) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

INSERT INTO departments (id, name)
VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (4, 'Marketing');

INSERT INTO employees (id, name, department_id)
VALUES
(101, 'Sam', 2),
(102, 'Alex', 1),
(103, 'Jordan', NULL),
(104, 'Taylor', 3),
(105, 'Morgan', 2),
(106, 'Casey', 1);

-- Inner Join
SELECT *
FROM employees E
INNER JOIN departments D
ON E.id = D.id;

-- Left join
SELECT *
FROM employees E 
LEFT JOIN departments D
on E.id = D.id;

-- Find null employee id
SELECT *
FROM Department D
LEFT JOIN Employee E
    ON D.department_id = E.department_id
WHERE E.id IS NULL; 

-- Count employees
SELECT
    d.DepartmentName,
    COUNT(e.EmployeeID) AS EmployeeCount
FROM Department d
LEFT JOIN Employee e
    ON d.DepartmentID = e.DepartmentID
GROUP BY d.DepartmentName;

-- Modify safely
UPDATE Employee
SET DepartmentID = 2
WHERE EmployeeID = 102;

DELETE FROM Employee
WHERE EmployeeID = 106;