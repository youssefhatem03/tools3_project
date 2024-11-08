import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function CourierOrders() {
  const [orders, setOrders] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [declinedOrders, setDeclinedOrders] = useState([]);

  // Load declined orders from localStorage on component mount
  useEffect(() => {
    const storedDeclinedOrders = JSON.parse(localStorage.getItem('declinedOrders')) || [];
    setDeclinedOrders(storedDeclinedOrders);
  }, []);

  // Fetch all orders on component mount
  useEffect(() => {
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

    fetchOrders();
  }, []);

  // Handle accept order: update status
  const acceptOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}/pickup`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: 'Picked Up' } : order
          )
        );
        setAlertMessage('Order status updated to Picked Up.');
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
