

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const navigate = useNavigate();
  

  const handleCloseAlert = () => {
    setAlertMessage(null);
};

const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!email) {
        setAlertMessage('Email is required.');
        return;
    }

    if (!password) {
        setAlertMessage('Password is required.');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        setAlertMessage('Invalid email format.');
        return;
    }

    if (password.length < 6) {
        setAlertMessage('Password must be at least 6 characters long.');
        return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userrole', data.role);
            localStorage.setItem('token', data.token);

            navigate('/dashboard');
        } else {
            setAlertMessage(data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login failed:', error);
        setAlertMessage('Login failed. Please try again later.');
    } finally {
        setIsSubmitting(false);
    }
};
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4">Welcome Back!</h3>

          {alertMessage && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {alertMessage}
              <button type="button" className="btn-close" onClick={() => setAlertMessage(null)}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-3">
            <button
              onClick={() => navigate('/signup')}
              className="btn btn-link p-0 text-decoration-none"
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
