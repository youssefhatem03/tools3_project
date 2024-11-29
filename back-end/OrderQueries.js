const pool = require('./db'); // Adjust the path as necessary
const bcrypt = require('bcryptjs');

const createOrder = (request, response) => {
  const {
    pickupLocation,
    dropOffLocation,
    packageDetails,
    deliveryTime,
    userId
  } = request.body;
  console.log(request.body);

  if (!pickupLocation || !dropOffLocation || !packageDetails || !deliveryTime || !userId) {
    return response.status(400).json({
      error: 'All fields are required'
    });
  }

  pool.query(
    'INSERT INTO orders (pickup_location, drop_off_location, package_details, delivery_time, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [pickupLocation, dropOffLocation, packageDetails, deliveryTime, userId],
    (error, results) => {
      if (error) {
        console.error("Database insert error:", error);
        return response.status(500).json({
          error: 'Error creating order'
        });
      }
      response.status(201).json({
        message: 'Order created successfully',
        orderId: results.rows[0].id
      });
    }
  );
};


// Fetch all orders
const getOrders = (request, response) => {
  pool.query('SELECT * FROM orders ORDER BY id ASC', (error, results) => {
    if (error) {
      console.error("Database fetch error:", error);
      return response.status(500).json({
        error: 'Error fetching orders'
      });
    }
    response.status(200).json(results.rows);
  });
};

const getOrdersWithCouriers = (request, response) => {
  pool.query(
    'SELECT orders.*, couriers.name AS Courier_Name FROM orders LEFT JOIN couriers ON orders.courier_id = couriers.id ORDER BY orders.id ASC',
    (error, results) => {
      if (error) {
        console.error("Database fetch error:", error);
        return response.status(500).json({
          error: 'Error fetching orders'
        });
      }
      response.status(200).json(results.rows);
    }
  );
};


const getUserOrders = (request, response) => {
  const userId = parseInt(request.params.userId);

  if (isNaN(userId)) {
    return response.status(400).json({
      error: 'Invalid user ID'
    });
  }

  pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY id ASC',
    [userId],
    (error, results) => {
      if (error) {
        console.error("Database fetch error:", error);
        return response.status(500).json({
          error: 'Error fetching user orders'
        });
      }
      response.status(200).json(results.rows);
    }
  );
};


const getPendingOrders = (request, response) => {
  pool.query(
    'SELECT * FROM orders WHERE status = $1 ORDER BY id ASC',
    ['pending'],
    (error, results) => {
      if (error) {
        console.error("Database fetch error:", error);
        return response.status(500).json({
          error: 'Error fetching pending orders',
        });
      }
      response.status(200).json(results.rows);
    }
  );
};

const getAssignedOrders = (request, response) => {
  const courierId = parseInt(request.params.courierId);

  if (isNaN(courierId)) {
    return response.status(400).json({
      error: 'Invalid courier ID'
    });
  }

  pool.query(
    'SELECT * FROM orders WHERE courier_id = $1 ORDER BY id ASC',
    [courierId],
    (error, results) => {
      if (error) {
        console.error("Database fetch error:", error);
        return response.status(500).json({
          error: 'Error fetching assigned orders'
        });
      }
      response.status(200).json(results.rows);
    }
  );
};


// Delete an order by ID
const deleteOrder = (request, response) => {
  const orderId = parseInt(request.params.id);

  if (isNaN(orderId)) {
    return response.status(400).json({
      error: 'Invalid order ID'
    });
  }

  pool.query('DELETE FROM orders WHERE id = $1', [orderId], (error, results) => {
    if (error) {
      console.error("Database delete error:", error);
      return response.status(500).json({
        error: 'Error deleting order'
      });
    }
    response.status(200).json({
      message: 'Order deleted successfully'
    });
  });
};

const updateOrderStatus = (request, response) => {
  const orderId = parseInt(request.params.id);

  if (isNaN(orderId)) {
    return response.status(400).json({
      error: 'Invalid order ID'
    });
  }

  pool.query(
    'UPDATE orders SET status = $1 WHERE id = $2',
    ['Picked Up', orderId],
    (error, results) => {
      if (error) {
        console.error("Database update error:", error);
        return response.status(500).json({
          error: 'Error updating order status'
        });
      }
      response.status(200).json({
        message: 'Order status updated to Picked Up'
      });
    }
  );
};

module.exports = {
  createOrder,
  getOrders,
  getOrdersWithCouriers,
  getUserOrders,
  getPendingOrders,
  deleteOrder,
  updateOrderStatus,
  getAssignedOrders
};