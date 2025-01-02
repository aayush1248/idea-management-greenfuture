import React, { useState, useEffect } from 'react';
import '../css/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notifications from './notification'; // Correct path to your Notifications component

const Dashboard = () => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const emails = localStorage.getItem('userEmail');
  const role = localStorage.getItem('userrole'); // Retrieve the user's role from local storage

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:3001/ideas', {
        idea: inputValue,
        email: emails,
        ideaConfirmStatus: false,
      });

      if (response.status === 201) {
        alert('Idea submitted successfully!');
        setMessage(`Idea submitted successfully! ID: ${response.data._id}`);
      } else {
        throw new Error('Failed to submit idea');
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || 'Unexpected error'
        : error.message;

      alert('Signup failed: ' + errorMessage);
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdeaNavigation = () => {
    navigate('/ideasList');
  };

  const handleIdeaNavigationVoteOnIdeas = () => {
    navigate('/ideasConfirmedList');
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    localStorage.removeItem('voted');
    navigate('/');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <div className="navbar">
        <h3 className="navbar-title">Dashboard</h3>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>

        {/* Render "Confirm Ideas" button only for employees */}
        {role === 'Regional Manager' && (
          <button className="Ideas" onClick={handleIdeaNavigation}>
            Confirm Ideas
          </button>
        )}

        <button className="IdeasConfirm" onClick={handleIdeaNavigationVoteOnIdeas}>
          Ideas to Vote
        </button>
        <Notifications />
      </div>

      <div className="form-container">
        <h2>Submit Your Idea</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="inputField">Enter your idea:</label>
            <input
              type="text"
              id="inputField"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Render the custom AlertDialog if showModal is true */}
      {showModal && (
        <AlertDialog message={modalMessage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Dashboard;
