import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../css/user-orders.css';

import 'bootstrap/dist/css/bootstrap.min.css';

function CourierOrders() {
  const [orders, setOrders] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [declinedOrders, setDeclinedOrders] = useState([]);
  const navigate = useNavigate();

  // Fetch all orders on component mount
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');

    // Validate if the user email belongs to an admin
    if (userEmail) {
      validateCourier(userEmail);
    } else {
      alert('Please log in first');
      navigate('/login');
    }
  }, [navigate]);

  // Validate if the email exists in the admins table
  const validateCourier = async (email) => {
    try {
      const response = await fetch('http://localhost:3000/validate-courier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // If the email is not valid, redirect to login
      if (!data.valid) {
        alert('You are not authorized to access this page. Please log in as a courier.');
        navigate('/login-courier');
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

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };


  // Handle accept order: update status
  // Handle accept order: update status and assign courier
const acceptOrder = async (orderId) => {
  const courierId = localStorage.getItem('userId'); // Retrieve courierId from localStorage
  if (!courierId) {
    alert('Courier ID not found. Please log in again.');
    navigate('/login-courier');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/orders/${orderId}/accept`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courier_id: parseInt(courierId) }), // Send courier_id in the request body
    });

    if (response.ok) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: 'Picked Up', courier_id: courierId } : order
        )
      );
      setAlertMessage('Order accepted and courier assigned successfully.');
    } else {
      console.error('Failed to update order status');
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

  // Handle decline order: remove from view without deleting from backend
  const declineOrder = (orderId) => {
    if (window.confirm('Are you sure you want to decline this order?')) {
      setDeclinedOrders((prevDeclined) => {
        const updatedDeclined = [...prevDeclined, orderId];
        localStorage.setItem('declinedOrders', JSON.stringify(updatedDeclined));
        return updatedDeclined;
      });
      setAlertMessage('Order has been declined.');
    }
  };

  // Filter orders to exclude declined ones
  const displayedOrders = orders.filter((order) => !declinedOrders.includes(order.id));

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Orders</h2>
      {alertMessage && (
        <Alert variant="info" onClose={() => setAlertMessage('')} dismissible>
          {alertMessage}
        </Alert>
      )}
      <div className="row">
        {displayedOrders.map((order) => (
          <div key={order.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title"><strong>Order Details</strong></h5>
                <p className="card-text"><strong>Pickup Location:</strong> {order.pickup_location}</p>
                <p className="card-text"><strong>Drop-off Location:</strong> {order.drop_off_location}</p>
                <p className="card-text"><strong>Package Details:</strong> {order.package_details}</p>
                <p className="card-text"><strong>Delivery Time:</strong> {new Date(order.delivery_time).toLocaleString()}</p>
                <p className="card-text"><strong>Status:</strong> {order.status || 'Pending'}</p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-success"
                    onClick={() => acceptOrder(order.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => declineOrder(order.id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourierOrders;
