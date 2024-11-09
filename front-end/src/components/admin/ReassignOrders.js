import React, { useEffect, useState } from 'react';
import { Alert, Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../css/user-orders.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [couriers, setCouriers] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourierId, setSelectedCourierId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      validateAdmin(userEmail);
    } else {
      alert('Please log in first');
      navigate('/login-admin');
    }
  }, [navigate]);

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
      if (!data.valid) {
        alert('You are not authorized to access this page. Please log in as an admin.');
        navigate('/login-admin');
      } else {
        fetchOrders();
        fetchCouriers();
      }
    } catch (error) {
      console.error('Validation error:', error);
      alert('An error occurred during validation. Please log in again.');
      navigate('/login');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/ordersWithCouriers');
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

  const fetchCouriers = async () => {
    try {
      const response = await fetch('http://localhost:3000/couriers');
      if (response.ok) {
        const data = await response.json();
        setCouriers(data);
      } else {
        console.error('Failed to fetch couriers');
      }
    } catch (error) {
      console.error('Error fetching couriers:', error);
    }
  };

  const openReassignModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const reassignCourier = async () => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${selectedOrderId}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courier_id: parseInt(selectedCourierId) }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrderId
              ? { ...order, courier_id: selectedCourierId, courier_name: couriers.find(courier => courier.id === parseInt(selectedCourierId)).name }
              : order
          )
        );
        setAlertMessage('Courier reassigned successfully.');
        setShowModal(false);
      } else {
        console.error('Failed to reassign courier');
      }
    } catch (error) {
      console.error('Error reassigning courier:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Orders</h2>
      {alertMessage && (
        <Alert variant="info" onClose={() => setAlertMessage('')} dismissible>
          {alertMessage}
        </Alert>
      )}
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
                <p className="card-text"><strong>Assigned Courier:</strong> {order.courier_name || 'None'}</p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-primary"
                    onClick={() => openReassignModal(order.id)}
                  >
                    Reassign Courier
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reassign Courier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formCourierSelect">
            <Form.Label>Select a Courier</Form.Label>
            <Form.Control
              as="select"
              value={selectedCourierId}
              onChange={(e) => setSelectedCourierId(e.target.value)}
            >
              <option value="">Choose...</option>
              {couriers.map((courier) => (
                <option key={courier.id} value={courier.id}>
                  {courier.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={reassignCourier}
            disabled={!selectedCourierId}
          >
            Reassign
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminOrders;
