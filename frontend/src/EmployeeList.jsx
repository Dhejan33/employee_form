import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom"; 

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null); 
  const [updatedEmployee, setUpdatedEmployee] = useState({
    employeeId: "",
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    department: "",
    dateOfJoining: "",
    role: ""
  });
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees"); 
        if (response.ok) {
          const data = await response.json();
          setEmployees(data); 
          setLoading(false);  
        } else {
          throw new Error("Failed to fetch employees");
        }
      } catch (error) {
        setError(error.message); 
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []); 

  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
        method: "DELETE", 
      });

      if (response.ok) {
        setEmployees((prevEmployees) => prevEmployees.filter(employee => employee.id !== employeeId));
      } else {
        throw new Error("Failed to delete employee");
      }
    } catch (error) {
      setError(error.message); 
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee); 
    setUpdatedEmployee(employee); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployee((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    // Check if any field is empty before proceeding
    if (
      !updatedEmployee.firstname ||
      !updatedEmployee.lastname ||
      !updatedEmployee.email ||
      !updatedEmployee.phoneNumber ||
      !updatedEmployee.department ||
      !updatedEmployee.dateOfJoining ||
      !updatedEmployee.role
    ) {
      alert("All fields must be filled out!");
      return; // Prevent update if any field is empty
    }

    try {
      const response = await fetch(`https://employee-form-backend-xyi9.onrender.com/api/employees/${updatedEmployee.id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedEmployee)
      });

      if (response.ok) {
        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
          )
        );
        setEditingEmployee(null); 
        setSuccessMessage("Employee updated successfully!"); // Set success message
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error("Failed to update employee");
      }
    } catch (error) {
      setError(error.message); 
    }
  };

  const handleAddEmployee = () => {
    navigate("/"); 
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6">
      <div className="bg-white rounded-lg shadow-lg border-t-4 border-blue-600 rounded-t px-5">
        <h2 className="text-3xl font-bold text-center my-4 text-gray-700">Employee Data</h2>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500 text-white p-3 rounded mb-4 flex justify-between items-center">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")} // Manually close the success message
              className="text-white font-bold"
            >
              x
            </button>
          </div>
        )}

        {/* Edit Employee Form */}
        {editingEmployee && (
          <div className="mb-4">
            <h3 className="font-bold text-2xl text-blue-700 text-left italic text-gray-700">Edit Employee</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
              <div className="flex items-center mb-3">
                <label htmlFor="firstname" className="block font-bold text-gray-700 w-1/4">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={updatedEmployee.firstname}
                  onChange={handleChange}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center mb-3">
                <label htmlFor="lastname" className="block font-bold text-gray-700 w-1/4">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={updatedEmployee.lastname}
                  onChange={handleChange}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center mb-3">
                <label htmlFor="email" className="block font-bold text-gray-700 w-1/4">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={updatedEmployee.email}
                  onChange={handleChange}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center mb-3">
                <label htmlFor="phoneNumber" className="block font-bold text-gray-700 w-1/4">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={updatedEmployee.phoneNumber}
                  onChange={handleChange}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center mb-3">
                <label htmlFor="department" className="block font-bold text-gray-700 w-1/4">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={updatedEmployee.department}
                  onChange={handleChange}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center mb-3">
                <label htmlFor="dateOfJoining" className="block font-bold text-gray-700 w-1/4">Date of Joining</label>
                <input
                  type="date"
                  id="dateOfJoining"
                  name="dateOfJoining"
                  value={updatedEmployee.dateOfJoining}
                  onChange={handleChange}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center mb-3">
                <label htmlFor="role" className="block font-bold text-gray-700 w-1/4">Role</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={updatedEmployee.role}
                  onChange={handleChange}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-center mb-3">
                <button
                    type="submit"
                    className="px-5 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-800"
                >
                    Save Changes
                </button>
                <button
                    type="button"
                    onClick={() => setEditingEmployee(null)}
                    className="ml-3 px-5 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-800"
                >
                    Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <table className="min-w-full table-auto border-collapse mt-5">
          <thead>
            <tr className="bg-green-100 text-gray-600">
              <th className="p-2 border text-left italic">Employee ID</th>
              <th className="p-2 border text-left italic">First Name</th>
              <th className="p-2 border text-left italic">Last Name</th>
              <th className="p-2 border text-left italic">Email</th>
              <th className="p-2 border text-left italic">Phone</th>
              <th className="p-2 border text-left italic">Department</th>
              <th className="p-2 border text-left italic">Date of Joining</th>
              <th className="p-2 border text-left italic">Role</th>
              <th className="p-2 border text-left italic">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="p-2 border">{employee.employeeId}</td>
                <td className="p-2 border">{employee.firstname}</td>
                <td className="p-2 border">{employee.lastname}</td>
                <td className="p-2 border">{employee.email}</td>
                <td className="p-2 border">{employee.phoneNumber}</td>
                <td className="p-2 border">{employee.department}</td>
                <td className="p-2 border">{employee.dateOfJoining}</td>
                <td className="p-2 border">{employee.role}</td>
                <td className="p-2 border flex items-center justify-between space-x-2">
                  <button
                    onClick={() => handleEdit(employee)} 
                    className="p-2 text-white bg-blue-600 hover:bg-blue-800 rounded-md"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="p-2 text-white bg-red-600 hover:bg-red-800 rounded-md"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center">
            <button
                onClick={handleAddEmployee}
                className="my-4 px-5 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-800"
            >
                Add Employee
            </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
