var mysql = require("mysql");
var inquirer = require("inquirer");
// const util = require("util");
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

var employees = [];
var employeeList = [];
// var eArray = [];
var roles = [];
var roleList = [];

function getEmployees(){
  employees = [];
  var query = "SELECT * FROM employee;";
  connection.query(query, function(err, res){
    for (i = 0; i < res.length; i++){
      employees.push(res[i]);
    }
      employees.forEach((element) => {
        employeeList.push(element.first_name + " " + element.last_name);
      })
      employeeList.push("Return to Main Menu");
      // console.log("GOT EMPLOYEES!");
      // console.log(employees);
      // console.log(employeeList);
      // eArray.push(employees);
      // eArray.push(employeeList); 
  })
  // return eArray;
};

getEmployees();
getRoles();

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

function viewByManager(){
  var managers = [];
  var managerList = [];
  var query = "select distinct(e.manager_id), m.first_name, m.last_name from employee e\n";
  query += "left join employee m on m.id = e.manager_id";
  async function getManagers(){
    await connection.query(query, function(err, res){
      for (i = 0; i < res.length; i++){
          managers.push(res[i]);
      }
      managers.shift();
      managers.forEach((element) => {
        managerList.push(element.first_name + " " + element.last_name);
      })
      // console.log(managers);
      // console.log(managerList);
      managerList.push("Return to Main Menu");
      promptUserForManager(managerList, managers);
    })
  };
  getManagers();

  function promptUserForManager(managerList, managers){
    var question = {
      name: "action",
      type: "rawlist",
      message: "Which manager would you like to view by?",
      choices: managerList
    }
    inquirer
    .prompt(question)
    .then(function(answer){
      if(answer.action === "Return to Main Menu"){
        runTracker();
      }
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
      query += "WHERE e.manager_id = ?\n";
      query += "ORDER BY e.id;";
      
      // console.log(question.choices.indexOf(answer.action));
      var manName = answer.action.split(" ");
      var manID;
      // console.log(manName);
      // console.log(managers);
      managers.forEach((element) => {
        if((element.first_name === manName[0]) && (element.last_name === manName[1])){
          manID = element.manager_id;
          // console.log(manID);
          connection.query(query, manID, async function(err, res) {
            await console.table(res);  
            viewByManager();
          })
        }
      })
    })
  }
}

async function addEmployee(){
  await getEmployees();
  await getRoles();
  // console.log(employeeList);
  addEmployeePrompt(roles, roleList, employees, employeeList);  
}

function getRoles(){
  roles = [];
  roleList = [];
  var query = "SELECT * FROM role;";
  connection.query(query, function(err, res){
    for (i = 0; i < res.length; i++){
      roles.push(res[i]);
    }
      roles.forEach((element) => {
        roleList.push(element.title);
      })
     roleList.push("Return to Main Menu"); 
  })
}

function addEmployeePrompt(roles, roleList, employees, employeeList){
  inquirer
  .prompt([
      {
        name: "fName",
        type: "input",
        message: "What is the new employee's first name?"
      },
      {
        name: "lName",
        type: "input",
        message: "What is the new employee's last name?"
      },
      {
        name: "role",
        type: "rawlist",
        message: "What is the new employee's role?",
        choices: roleList
      },
      {
        name: "manager",
        type: "rawlist",
        message: "Who is the new employee's manager?",
        choices: employeeList
      }
  ])
  .then(function(answer){
    // if (err) throw err;
    // console.log("New Employee: " + JSON.stringify(answer));
    var manName = answer.manager.split(" ");
    var manID;
    employees.forEach((element) => {
      if((element.first_name === manName[0]) && (element.last_name === manName[1])){
        manID = element.id;
        // console.log(manID);
      }
    })
    var roleID;
    roles.forEach((element) => {
      if(element.title === answer.role){
        roleID = element.id;
        // console.log(roleID);
      }
    })
    query = "INSERT INTO employee (first_name, last_name, role_id, manager_id)\n";
    query += "VALUES (" + JSON.stringify(answer.fName) + ", " + JSON.stringify(answer.lName) + ", ";
    query += JSON.stringify(roleID) + ", " + JSON.stringify(manID) + ")";
    connection.query(query, function(err, res){
      if(err) throw err;
      console.log("Added " + answer.fName + " " + answer.lName + " to the database");
      runTracker();
      getEmployees();
    })
  })
}

async function removeEmployee(){
  // console.log("REMOVING EMPLOYEES")
  // console.log(employees);
  // console.log(employeeList);
  await inquirer
  .prompt([
      {
        name: "employee",
        type: "rawlist",
        message: "Which employee do you wish to delete?",
        choices: employeeList
      }
  ])
  .then(function(answer){
    // if (err) throw err;
    // console.log("Employee to remove: " + JSON.stringify(answer));
    var delName = answer.employee.split(" ");
    var delID;
    employees.forEach((element) => {
      if((element.first_name === delName[0]) && (element.last_name === delName[1])){
        delID = element.id;
        // console.log(typeof delID);
      }
      query = "DELETE FROM employee where id = ?";
    })
    connection.query(query, [delID], function(err, res){
      if(err) throw err;
      console.log("Deleted " + answer.employee + " from the database");
      runTracker();
      getEmployees();
    })
  })
}

async function updateRole(){
  var employeeName;
  var employeeID;
  var roleID;
  await inquirer
  .prompt([
      {
        name: "employee",
        type: "rawlist",
        message: "Which employee's role do you wish to update?",
        choices: employeeList
      }
  ])
  .then(function(answer){
    employeeName = answer.employee.split(" ");
    employees.forEach((element) => {
      if((element.first_name === employeeName[0]) && (element.last_name === employeeName[1])){
        employeeID = element.id;
        // console.log(typeof delID);
      }
    });
  })
  await inquirer
  .prompt(
    {
      name: "newRole",
        type: "rawlist",
        message: "What is " + employeeName[0] + " " + employeeName[1] + "'s new role?",
        choices: roleList
    }
  )
  .then(function(answer){
    roles.forEach((element) => {
      if(element.title === answer.newRole){
        roleID = element.id;
        // console.log(roleID);
      }
    })
  })
  var query = "UPDATE employee\n";
  query += "SET role_id = ?\n";
  query += "WHERE id = ?"
  connection.query(query, [roleID, employeeID], function(err, res){
    if (err) throw err;
    console.log("Role updated!")
    runTracker();
    getEmployees();
  })
}