  import React, { useState } from "react";

  function EmployeeForm() {
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

    // Handle input change
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    // Form validation
    const validateForm = () => {
      let formErrors = {};
      if (!formData.firstname) formErrors.firstname = "First Name is required.";
      if (!formData.employeeId)
        formErrors.employeeId = "Employee ID is required.";
      else if (formData.employeeId.length > 10)
        formErrors.employeeId = "Employee ID must be 10 characters or less.";
      if (!formData.email)
        formErrors.email = "Email is required.";
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

    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
      } else {
        try {
          const response = await fetch("http://localhost:5000/submit-form", {
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

            // Reset the form
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

    // Handle reset
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
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Form Validation</h2>
          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="mb-3">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter First Name"
              />
              {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>}
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter Last Name"
              />
            </div>

            {/* Employee ID */}
            <div className="mb-3">
              <label className="block text-gray-700">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter Employee ID"
              />
              {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter Email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="mb-3">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter 10-digit Phone Number"
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Department */}
            <div className="mb-3">
              <label className="block text-gray-700">Department</label>
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
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            {/* Date of Joining */}
            <div className="mb-3">
              <label className="block text-gray-700">Date of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.dateOfJoining && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfJoining}</p>
              )}
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="block text-gray-700">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter Role (e.g., Manager)"
              />
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  export default EmployeeForm;
