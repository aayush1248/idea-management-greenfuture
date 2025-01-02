import React, { useState, useEffect } from 'react';
import '../css/SignUpForm.css'; // Importing the CSS
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertDialog from './constant/alertDialog'; // Import the AlertDialog component


function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    voted: false // Default role
  });

   
  
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false); // State for dialog visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    axios
      .post('http://localhost:3001/register', formData)
      .then((result) => {
        console.log('Signup successful:', result.data);
        localStorage.setItem('userEmail', email);
      //  saveTokenToServer();
        setSuccessMessage('Signup Successful! 🎉');
        setShowDialog(true); // Show the dialog
        setFormData({ name: '', email: '', password: '', role: 'employee', voted: false }); // Reset form data
      })
      .catch((err) => {
        console.error('Error during signup:', err.response ? err.response.data : err.message);
        alert('Signup failed: ' + (err.response ? err.response.data.message : 'Unexpected error'));
      });
  };

  const handleCloseDialog = () => {
    setShowDialog(false); // Close the dialog
    navigate('/'); // Navigate to the dashboard after closing the dialog
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Dropdown for selecting role */}
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">Employee</option>
            <option value="admin">Regional Manager</option>
            <option value="moderator">Innovative Manager</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Sign Up
        </button>
      </form>

      {/* AlertDialog Component */}
      {showDialog && (
        <AlertDialog
          message={<p>{successMessage}</p>}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}

export default SignUpForm;
