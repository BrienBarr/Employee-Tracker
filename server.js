var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Darwin@Maddy6",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runTracker();
});

function runTracker() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Exit",
      ]      
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View All Employees":
        viewEmployees();
        break;

      case "View All Employees By Department":
        viewByDepartment();
        break;

      case "View All Employees By Manager":
        viewByManager();
        break;

      case "Add Employee":
        addEmployee();
        break;

      case "Remove Employee":
        removeEmployee();
        break;

      case "Update Employee Role":
        updateRole();
        break;

      case "Update Employee Manager":
        updateManager();
        break;

      case "Exit":
        connection.end();
        break;
      }
    });
};

function viewEmployees(){
  var query = "select e.id,\n"; 
  query += "e.first_name,\n";
  query += "e.last_name,\n";
  query += "role.title,\n";
  query += "department.name as department,\n";
  query += "role.salary,\n";
  query += "Concat(m.first_name, ' ', m.last_name) as manager\n";
  query += "from employee e\n";
  query += "INNER JOIN role on e.role_id = role.id\n";
  query += "INNER JOIN department on role.department_id = department.id\n";
  query += "left join employee m on  m.id = e.manager_id\n";
  query += "ORDER BY e.id;";
    connection.query(query, async function(err, res) {
      await console.table(res);  
      runTracker();
    })
}

function viewByDepartment(){
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Which department would you like to view?",
      choices: [
        "Engineering",
        "Finance",
        "Legal",
        "Sales",
        "Return to the Main Menu"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Engineering":
        viewDepartment("Engineering");
        break;

      case "Finance":
        viewDepartment("Finance");
        break;

      case "Legal":
        viewDepartment("Legal");
        break;

      case "Sales":
        viewDepartment("Sales");
        break;

      case "Return to the Main Menu":
        runTracker();
        break;
      }
    });
}

function viewDepartment(department){
  var query = "select e.id,\n"; 
  query += "e.first_name,\n";
  query += "e.last_name,\n";
  query += "role.title,\n";
  query += "department.name as department,\n";
  query += "role.salary,\n";
  query += "Concat(m.first_name, ' ', m.last_name) as manager\n";
  query += "from employee e\n";
  query += "INNER JOIN role on e.role_id = role.id\n";
  query += "INNER JOIN department on role.department_id = department.id\n";
  query += "left join employee m on  m.id = e.manager_id\n";
  query += "WHERE department.name = ?\n";
  query += "ORDER BY e.id;";
  
  connection.query(query, department, async function(err, res) {
    await console.table(res);  
    viewByDepartment();
  })
}