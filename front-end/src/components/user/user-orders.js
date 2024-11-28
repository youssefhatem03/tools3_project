import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/user-orders.css';

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Fetch user orders
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const userEmail = localStorage.getItem('userEmail');

    if (!userId || !username || !userEmail) {
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
          } else {
            // Fetch user orders after successful validation
            const fetchUserOrders = async () => {
              try {
                const response = await fetch(`http://localhost:3000/user-orders/${userId}`);
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
            fetchUserOrders();
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

  // Cancel an order
  function cancelOrder(orderId) {
    fetch(`http://localhost:3000/CancelOrder/${orderId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          // Remove the cancelled order from the orders array
          setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Something went wrong, please try again later.');
      });
  }

  return (
    <div className="container user-orders-container">
      <h2 className="text-center order">Your Orders</h2>
      <button
        className="btn btn-create-order"
        onClick={() => navigate('/create-order')}
      >
        Create Order
      </button>
      {orders.length > 0 ? (
        <div className="orders-container">
          {orders.map((order) => (
            <div key={order.id} className="card order-card">
              <div className="card-body">
                <h5 className="card-title"><strong>Order Details</strong></h5>
                <p className="card-text"><strong>Pickup Location:</strong> {order.pickup_location}</p>
                <p className="card-text"><strong>Drop-off Location:</strong> {order.drop_off_location}</p>
                <p className="card-text"><strong>Package Details:</strong> {order.package_details}</p>
                <p className="card-text"><strong>Delivery Time:</strong> {new Date(order.delivery_time).toLocaleString()}</p>
                <p className="card-text"><strong>Status:</strong> {order.status}</p>
                <button
                  className="btn btn-danger mt-3"
                  onClick={() => cancelOrder(order.id)}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No orders found.</p>
      )}
    </div>
  );
}

export default UserOrders;
