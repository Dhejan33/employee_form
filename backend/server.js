require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json()); 

// Database connection
const db = mysql.createConnection({
  host: process.env.host,      
  user: process.env.user,           
  password: process.env.password,   
  database: process.env.database,
  port: process.env.port
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
    return;
  }
  console.log("Connected to MySQL database");

  // Table creation query
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS employee_details (
      id INT NOT NULL AUTO_INCREMENT,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      employeeId VARCHAR(10) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phoneNumber VARCHAR(10) NOT NULL,
      department VARCHAR(255) NOT NULL,
      dateOfJoining DATE NOT NULL,
      role VARCHAR(255) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY employeeId (employeeId),
      UNIQUE KEY email (email)
    );`;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating table:", err.message);
      return;
    }
    console.log("Table 'employee_details' is ready.");
  });
});

// POST endpoint to handle form submission
app.post("/submit-form", (req, res) => {
  const {
    firstname,
    lastname,
    employeeId,
    email,
    phoneNumber,
    department,
    dateOfJoining,
    role,
  } = req.body;

  // Check if employeeId or email already exists
  const checkExistingQuery = `
    SELECT * FROM employee_details WHERE employeeId = ? OR email = ?;
  `;
  db.query(checkExistingQuery, [employeeId, email], (err, result) => {
    if (err) {
      console.error("Error checking existing data:", err.message);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    if (result.length > 0) {
      return res.status(400).json({
        message: "Employee ID or Email already exists.",
      });
    }

    // Proceed with insert
    const query = `
      INSERT INTO employee_details (firstname, lastname, employeeId, email, phoneNumber, department, dateOfJoining, role) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [firstname, lastname, employeeId, email, phoneNumber, department, dateOfJoining, role],
      (err, result) => {
        if (err) {
          console.error("Error inserting data:", err.message);
          return res.status(500).json({ message: "Database error", error: err.message });
        }
        res.status(200).json({ message: "Employee added successfully!", data: result });
      }
    );
  });
});

// GET endpoint to fetch all employees
// GET endpoint to fetch all employees
app.get("/api/employees", (req, res) => {
  const query = "SELECT * FROM employee_details";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching data:", err.message);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    // Format the `dateOfJoining` field to dd-mm-yyyy or yyyy-mm-dd
    const formattedResult = result.map((employee) => {
      const dateOfJoining = new Date(employee.dateOfJoining);
      const formattedDate = dateOfJoining.toISOString().split('T')[0]; // Format as yyyy-mm-dd

      return {
        ...employee,
        dateOfJoining: formattedDate,
      };
    });

    res.status(200).json(formattedResult); // Return the result with formatted date
  });
});


// DELETE endpoint to delete an employee
app.delete('/api/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const query = 'DELETE FROM employee_details WHERE id = ?'; // Use the correct table name

  db.query(query, [employeeId], (error, results) => {  // Use `db.query` here
    if (error) {
      console.error("Error deleting employee:", error.message);
      return res.status(500).send({ message: 'Failed to delete employee' });
    }
    res.status(200).send({ message: 'Employee deleted successfully' });
  });
});

// PUT endpoint to update employee details
app.put('/api/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const {
    firstname,
    lastname,
    employeeId: newEmployeeId,
    email,
    phoneNumber,
    department,
    dateOfJoining,
    role,
  } = req.body;

  // Check if employeeId or email already exists for another employee
  const checkExistingQuery = `
    SELECT * FROM employee_details WHERE (employeeId = ? OR email = ?) AND id != ?;
  `;
  db.query(checkExistingQuery, [newEmployeeId, email, employeeId], (err, result) => {
    if (err) {
      console.error("Error checking existing data:", err.message);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    if (result.length > 0) {
      return res.status(400).json({
        message: "Employee ID or Email already exists for another employee.",
      });
    }

    // Proceed with the update
    const updateQuery = `
      UPDATE employee_details
      SET firstname = ?, lastname = ?, employeeId = ?, email = ?, phoneNumber = ?, department = ?, dateOfJoining = ?, role = ?
      WHERE id = ?
    `;
    db.query(
      updateQuery,
      [firstname, lastname, newEmployeeId, email, phoneNumber, department, dateOfJoining, role, employeeId],
      (err, result) => {
        if (err) {
          console.error("Error updating data:", err.message);
          return res.status(500).json({ message: "Database error", error: err.message });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({ message: "Employee updated successfully", data: result });
      }
    );
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
