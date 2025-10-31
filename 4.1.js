const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let employees = [];

function showMenu() {
  console.log("\n=== Employee Management System ===");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Remove Employee");
  console.log("4. Exit");
  
  rl.question("Enter your choice: ", handleMenu);
}

function handleMenu(choice) {
  switch (choice.trim()) {
    case '1':
      addEmployee();
      break;
    case '2':
      listEmployees();
      break;
    case '3':
      removeEmployee();
      break;
    case '4':
      console.log("Exiting program...");
      rl.close();
      break;
    default:
      console.log("Invalid choice. Please try again.");
      showMenu();
  }
}

function addEmployee() {
  rl.question("Enter Employee Name: ", (name) => {
    rl.question("Enter Employee ID: ", (id) => {
      employees.push({ id, name });
      console.log(`✅ Employee ${name} (ID: ${id}) added successfully.`);
      showMenu();
    });
  });
}

function listEmployees() {
  if (employees.length === 0) {
    console.log("No employees found.");
  } else {
    console.log("\nCurrent Employees:");
    employees.forEach((emp, index) => {
      console.log(`${index + 1}. ID: ${emp.id}, Name: ${emp.name}`);
    });
  }
  showMenu();
}

function removeEmployee() {
  rl.question("Enter Employee ID to remove: ", (id) => {
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      const removed = employees.splice(index, 1);
      console.log(`🗑️ Employee ${removed[0].name} (ID: ${id}) removed successfully.`);
    } else {
      console.log(`❌ Employee with ID ${id} not found.`);
    }
    showMenu();
  });
}

// Start the program
showMenu();
