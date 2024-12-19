const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json()); 

// Database connection
const db = mysql.createConnection({
  host: "bcghigkxamxfzawrqvpg-mysql.services.clever-cloud.com",      
  user: "u2w2zlwjgfzybe4a",           
  password: "RaWM4pgIBzI86YlISyzt",   
  database: "bcghigkxamxfzawrqvpg",
  port: '3306'  
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
