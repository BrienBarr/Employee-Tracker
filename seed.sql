INSERT INTO department (name)
VALUES ("Engineering"),
("Finance"),
("Legal"),
("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 100000.00, 2),
("Lawyer", 120000.00, 3),
("Lead Engineer", 130000.00, 1),
("Legal Lead", 150000.00, 3),
("Sales Lead", 80000.00, 4),
("Salesperson", 60000.00, 4),
("Software Engineer", 80000.00, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 6, null),
("Amy", "Anderson", 5, null),
("Peter", "Graves", 3, null),
("Alan", "Hammond", 7, null),
("Bob", "Baker", 1, null),
("Henry", "Cole", 4, null),
("Jennifer", "Jacobs", 2, null),
("Finley", "Barr", 7, null),
("Frankie", "Barr", 2, null);

UPDATE employee
SET manager_id = 2
WHERE role_id = 6;

UPDATE employee
SET manager_id = 3
WHERE role_id = 7;

UPDATE employee
SET manager_id = 6
WHERE role_id = 2;