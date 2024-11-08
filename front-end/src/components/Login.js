import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Auth.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log(userData); // Log the entire user data to check its structure

        // Store user data in local storage
        localStorage.setItem('userId', userData.user.id);
        localStorage.setItem('username', userData.user.name);

        navigate('/create-order');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Email or password does not match');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <h2 className="text-center mb-4">Login to Your Account</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
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
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Login</button>
        </form>
        <p className="text-center mt-3">
          <Link to="/register">Don't have an account? Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
