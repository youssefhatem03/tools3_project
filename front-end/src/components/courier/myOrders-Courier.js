import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyOrdersCourier() {
  const [myOrders, setMyOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const courierId = localStorage.getItem('userId');
    if (!courierId) {
      alert('Courier ID not found. Please log in.');
      navigate('/login-courier');
      return;
    }

    fetchCourierOrders(courierId);
  }, [navigate]);

  const fetchCourierOrders = async (courierId) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/assigned/${courierId}`);
      if (response.ok) {
        const data = await response.json();
        setMyOrders(data);
      } else {
        console.error('Failed to fetch courier orders');
      }
    } catch (error) {
      console.error('Error fetching courier orders:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Orders</h2>
      <div className="row">
        {myOrders.map((order) => (
          <div key={order.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title"><strong>Order Details</strong></h5>
                <p className="card-text"><strong>Pickup Location:</strong> {order.pickup_location}</p>
                <p className="card-text"><strong>Drop-off Location:</strong> {order.drop_off_location}</p>
                <p className="card-text"><strong>Package Details:</strong> {order.package_details}</p>
                <p className="card-text"><strong>Delivery Time:</strong> {new Date(order.delivery_time).toLocaleString()}</p>
                <p className="card-text"><strong>Status:</strong> {order.status || 'Pending'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrdersCourier;
