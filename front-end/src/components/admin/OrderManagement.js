import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');

    // Validate if the user email belongs to an admin
    if (userEmail) {
      validateAdmin(userEmail);
    } else {
      alert('Please log in first');
      navigate('/login-admin');
    }
  }, [navigate]);

  // Validate if the email exists in the admins table
  const validateAdmin = async (email) => {
    try {
      const response = await fetch('http://localhost:3000/validate-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // If the email is not valid, redirect to login
      if (!data.valid) {
        alert('You are not authorized to access this page. Please log in as an admin.');
        navigate('/login');
      } else {
        // Fetch orders only if the admin validation is successful
        fetchOrders();
      }
    } catch (error) {
      console.error('Validation error:', error);
      alert('An error occurred during validation. Please log in again.');
      navigate('/login');
    }
  };

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setErrorMessage('Failed to fetch orders');
      }
    } catch (error) {
      setErrorMessage('Error fetching orders');
    }
  };

  // Update order status to "Picked Up"
  const updateOrderStatus = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}/pickup`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: 'Picked Up' } : order
        ));
      } else {
        setErrorMessage('Failed to update order status');
      }
    } catch (error) {
      setErrorMessage('Error updating order status');
    }
  };

  // Delete an order
  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId));
      } else {
        setErrorMessage('Failed to delete order');
      }
    } catch (error) {
      setErrorMessage('Error deleting order');
    }
  };

  // Navigate to reassignOrders page
  const handleReassignOrder = () => {
    navigate('/reassignOrders');
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Order Management</h2>
      
      {/* Reassign Order Button */}
      <button
        className="btn btn-warning mb-3"
        onClick={handleReassignOrder}
      >
        Reassign Order
      </button>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Pickup Location</th>
            <th>Drop-Off Location</th>
            <th>Package Details</th>
            <th>Delivery Time</th>
            <th>User ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.pickup_location}</td>
              <td>{order.drop_off_location}</td>
              <td>{order.package_details}</td>
              <td>{order.delivery_time}</td>
              <td>{order.user_id}</td>
              <td>{order.status || 'Pending'}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm mx-1"
                  onClick={() => updateOrderStatus(order.id)}
                  disabled={order.status === 'Picked Up'}
                >
                  {order.status === 'Picked Up' ? 'Picked Up' : 'Mark as Picked Up'}
                </button>
                <button
                  className="btn btn-danger btn-sm mx-1"
                  onClick={() => deleteOrder(order.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderManagement;
