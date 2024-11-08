import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/create-order.css'; 

function Order() {
  const [orderData, setOrderData] = useState({
    pickupLocation: '',
    dropOffLocation: '',
    packageDetails: '',
    deliveryTime: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
  
    if (!userId || !username) {
      alert('Please log in first');
      navigate('/login');
    } else {
      const validateUser = async () => {
        try {
          const response = await fetch('http://localhost:3000/validate-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          });
          const data = await response.json();
          if (!data.valid) {
            alert('User validation failed. Please log in again.');
            navigate('/login');
          }
        } catch (error) {
          console.error('Validation error:', error);
          alert('An error occurred during validation. Please log in again.');
          navigate('/login');
        }
      };
      validateUser();
    }
  }, [navigate]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage
    const orderDataWithUserId = {
      ...orderData,
      userId, // Add userId to order data
    };
  
    try {
      const response = await fetch('http://localhost:3000/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDataWithUserId), // Send updated order data
      });
      if (response.ok) {
        alert('Order created successfully');
        navigate('/user-orders');
      } else {
        alert('Failed to create order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  return (
    <div className="auth-wrapper">
      <div className="auth-inner order-inner">
        <h2>Create Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pickup Location</label>
            <input
              type="text"
              className="form-control"
              value={orderData.pickupLocation}
              onChange={(e) => setOrderData({ ...orderData, pickupLocation: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Drop-off Location</label>
            <input
              type="text"
              className="form-control"
              value={orderData.dropOffLocation}
              onChange={(e) => setOrderData({ ...orderData, dropOffLocation: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Package Details</label>
            <input
              type="text"
              className="form-control"
              value={orderData.packageDetails}
              onChange={(e) => setOrderData({ ...orderData, packageDetails: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Delivery Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={orderData.deliveryTime}
              onChange={(e) => setOrderData({ ...orderData, deliveryTime: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Create Order</button>
        </form>
      </div>
    </div>
  );
}

export default Order;
