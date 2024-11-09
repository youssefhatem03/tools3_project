import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Auth.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e, isAdmin = false) => {
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
        console.log(userData);

        // Store user data in local storage
        localStorage.setItem('userId', userData.user.id);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('username', userData.user.name);

        // Determine the appropriate navigation path based on email or admin flag
        if (isAdmin) {
          navigate('/OrderManagement');
        } else if (formData.email.includes('@courier.com')) {
          navigate('/CourierOrders');
        } else {
          navigate('/create-order');
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Email or password does not match');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  // Function to clear local storage
 

  return (
    <div className="auth-wrapper d-flex justify-content-center align-items-center min-vh-100">
      <div className="auth-inner p-4 shadow rounded" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login to Your Account</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={(e) => handleSubmit(e)}>
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

          <button type="submit" className="btn btn-primary btn-block w-100 mb-1">Login</button>

          <Link to="/login-courier">
            <button
              type="button"
              className="btn btn-outline-secondary btn-block w-100 mb-1"
            >
              Login as Courier
            </button>
          </Link>
          <Link to="/login-admin">
            <button
              type="button"
              className="btn btn-outline-danger btn-block w-100 mb-1"
            >
              Login as Admin
            </button>
          </Link> 
        </form>

        <p className="text-center mt-3">
          <Link to="/register">Don't have an account? Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
