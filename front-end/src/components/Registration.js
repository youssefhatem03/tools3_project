import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Define isLoading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Password length validation
    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Error: Unable to register. Please check your connection and try again.');
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:3000/');
      if (response.ok) {
        console.log('Backend connection is successful');
      } else {
        console.error('Backend connection failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    testConnection(); // Test connection on component mount
  }, []);

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <h2 className="text-center mb-4">Create an Account</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Phone Number</label>
            <input
              type="tel"
              className="form-control"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
