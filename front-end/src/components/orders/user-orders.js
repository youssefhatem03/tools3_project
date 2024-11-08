import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/user-orders.css';

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in first');
      navigate('/login');
    } else {
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
  }, [navigate]);

  // Function to cancel an order
  const cancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Order cancelled successfully');
          // Update the orders list in the state
          setOrders(orders.filter((order) => order.id !== orderId));
        } else {
          console.error('Failed to cancel order');
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 order">Your Orders</h2>
      {orders.length > 0 ? (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title"><strong>Order Details</strong></h5>
                  <p className="card-text"><strong>Pickup Location:</strong> {order.pickup_location}</p>
                  <p className="card-text"><strong>Drop-off Location:</strong> {order.drop_off_location}</p>
                  <p className="card-text"><strong>Package Details:</strong> {order.package_details}</p>
                  <p className="card-text"><strong>Delivery Time:</strong> {new Date(order.delivery_time).toLocaleString()}</p>
                  <p className="card-text"><strong>Status:</strong> {order.status || 'Pending'}</p>
                  <button
                    className="btn btn-danger mt-3"
                    onClick={() => cancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                </div>
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
