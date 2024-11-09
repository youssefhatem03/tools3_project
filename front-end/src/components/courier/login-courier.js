import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Auth.css';

function LoginCourier() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login-courier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const courierData = await response.json();
        localStorage.setItem('userId', courierData.admin.id); // Store admin ID
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('username', courierData.admin.name);

        navigate('/CourierOrders'); // Redirect to OrderManagement
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
    <div className="auth-wrapper d-flex justify-content-center align-items-center min-vh-100">
      <div className="auth-inner p-4 shadow rounded" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Courier Login</h2>

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

          <button type="submit" className="btn btn-primary btn-block w-100 mb-1">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginCourier;
