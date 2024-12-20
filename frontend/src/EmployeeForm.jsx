import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function EmployeeForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    employeeId: "",
    email: "",
    phoneNumber: "",
    department: "",
    dateOfJoining: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const departments = ["HR", "Engineering", "Marketing", "Finance", "Sales"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.firstname) formErrors.firstname = "First Name is required.";
    if (!formData.employeeId)
      formErrors.employeeId = "Employee ID is required.";
    else if (formData.employeeId.length > 10)
      formErrors.employeeId = "Employee ID must be 10 characters or less.";
    if (!formData.email) formErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      formErrors.email = "Invalid email format.";
    if (!formData.phoneNumber)
      formErrors.phoneNumber = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.phoneNumber))
      formErrors.phoneNumber = "Phone number must be a 10-digit number.";
    if (!formData.department)
      formErrors.department = "Please select a department.";
    if (!formData.dateOfJoining)
      formErrors.dateOfJoining = "Date of Joining is required.";
    else if (new Date(formData.dateOfJoining) > new Date())
      formErrors.dateOfJoining = "Date of Joining cannot be a future date.";
    if (!formData.role) formErrors.role = "Role is required.";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await fetch("https://employee-form-backend-xyi9.onrender.com/submit-form", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Employee added successfully!");
          const data = await response.json();
          console.log("Response from backend:", data);

          setFormData({
            firstname: "",
            lastname: "",
            employeeId: "",
            email: "",
            phoneNumber: "",
            department: "",
            dateOfJoining: "",
            role: "",
          });
          setErrors({});

          // Navigate to the EmployeeList page
          navigate('/employees');
          
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error submitting form:", error.message);
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  const handleReset = () => {
    setFormData({
      firstname: "",
      lastname: "",
      employeeId: "",
      email: "",
      phoneNumber: "",
      department: "",
      dateOfJoining: "",
      role: "",
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-3">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg border-t-4 border-blue-600 rounded-t">
          <h2 className="text-3xl font-bold text-center my-4 text-gray-700">
            Employee Data
          </h2>
          <form onSubmit={handleSubmit} className="px-6 py-3 grid grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block font-semibold text-blue-600">
                First Name<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter First Name"
              />
              <p className="text-gray-700 italic text-sm mt-1">(e.g., Abishek)</p>
              {errors.firstname && (
                <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block font-semibold text-blue-600">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter Last Name"
              />
              <p className="text-gray-700 italic text-sm mt-1">(e.g., Sharma)</p>
            </div>

            {/* Employee ID */}
            <div>
              <label className="block font-semibold text-blue-600">
                Employee ID<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter Employee ID (e.g., 22IT0XX)"
              />
              <p className="text-red-700 italic text-sm mt-1">[NOTE: Once entered cannot be edited]</p>
              {errors.employeeId && (
                <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-blue-600">
                Email<span className="text-red-600"> *</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter Email"
              />
              <p className="text-gray-700 italic text-sm mt-1">(e.g., "email@gmail.com")</p>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-semibold text-blue-600">
                Phone Number<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter 10-digit Phone Number"
              />
              <p className="text-gray-700 italic text-sm mt-1">(e.g., 9876543210)</p>
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block font-semibold text-blue-600">
                Department<span className="text-red-600"> *</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <p className="text-gray-700 italic text-sm mt-1">(e.g., HR Department)</p>
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">{errors.department}</p>
              )}
            </div>

            {/* Date of Joining */}
            <div>
              <label className="block font-semibold text-blue-600">
                Date of Joining<span className="text-red-600"> *</span>
              </label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <p className="text-gray-700 italic text-sm mt-1">(e.g., 01-01-2001)</p>
              {errors.dateOfJoining && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfJoining}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block font-semibold text-blue-600">
                Role<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter Role"
              />
              <p className="text-gray-700 italic text-sm mt-1">(e.g., Manager)</p>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-center space-x-5 py-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-5 py-2 shadow-lg rounded-lg hover:bg-green-800"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-red-600 text-white px-5 py-2 shadow-lg rounded-lg hover:bg-red-800"
              >
                Reset
              </button>
              <button
                onClick={() => navigate("/employees")}
                className="bg-blue-600 text-white px-5 py-2 shadow-lg rounded-lg hover:bg-blue-800"
              >
                View Table
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default EmployeeForm;
