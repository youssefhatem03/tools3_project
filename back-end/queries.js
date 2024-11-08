//queries.js
const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'API',
  password: '12345678',
  port: 5432,
});

// Fetch all users
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Fetch a user by ID
const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Update a user by ID
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    name,
    email,
    phone,
    password
  } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2, phone = $3, password = $4 WHERE id = $5',
    [name, email, phone, password, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

// Delete a user by ID
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

// Create a new user with hashed password
const createUser = async (request, response) => {
  const {
    name,
    email,
    phone,
    password
  } = request.body;
  console.log("Request body:", request.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    pool.query(
      'INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, phone, hashedPassword],
      (error, results) => {
        if (error) {
          console.error("Database insert error:", error);
          return response.status(500).json({
            error: 'Error creating user'
          });
        }
        response.status(201).json({
          id: results.rows[0].id
        });
      }
    );
  } catch (error) {
    console.error("Hashing error:", error);
    response.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Login a user by validating hashed password
const loginUser = async (request, response) => {
  const {
    email,
    password
  } = request.body;

  pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email],
    async (error, results) => {
      if (error) {
        return response.status(500).json({
          error: 'Database error'
        });
      }
      if (results.rows.length > 0) {
        const user = results.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          response.status(200).json({
            message: 'Login successful',
            user: {
              id: user.id,
              name: user.name,
            },
          });
        } else {
          response.status(401).json({
            message: 'Invalid credentials'
          });
        }
      } else {
        response.status(401).json({
          message: 'Invalid credentials'
        });
      }
    }
  );
};


const validate_user = async (req, res) => {
  const userId = parseInt(req.body.userId); // Ensure userId is an integer

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      return res.status(200).json({ valid: true });
    } else {
      return res.status(404).json({ valid: false });
    }
  } catch (error) {
    console.error('Error validating user:', error.stack); // Log the full error stack
    return res.status(500).json({ message: 'Server error' });
  }
};




// Insert a new order
// Insert a new order with validation
const createOrder = (request, response) => {
  const { pickupLocation, dropOffLocation, packageDetails, deliveryTime, userId } = request.body;

  // Validation checks
  if (!pickupLocation || !dropOffLocation || !packageDetails || !deliveryTime || !userId) {
    return response.status(400).json({ error: 'All fields are required' });
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


const getUserOrders = (request, response) => {
  const userId = parseInt(request.params.userId);

  if (isNaN(userId)) {
    return response.status(400).json({ error: 'Invalid user ID' });
  }

  pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY id ASC',
    [userId],
    (error, results) => {
      if (error) {
        console.error("Database fetch error:", error);
        return response.status(500).json({ error: 'Error fetching user orders' });
      }
      response.status(200).json(results.rows);
    }
  );
};

// Delete an order by ID
const deleteOrder = (request, response) => {
  const orderId = parseInt(request.params.id);

  if (isNaN(orderId)) {
    return response.status(400).json({ error: 'Invalid order ID' });
  }

  pool.query('DELETE FROM orders WHERE id = $1', [orderId], (error, results) => {
    if (error) {
      console.error("Database delete error:", error);
      return response.status(500).json({ error: 'Error deleting order' });
    }
    response.status(200).json({ message: 'Order deleted successfully' });
  });
};



// Uncomment if using CORS
// const cors = require('cors');
// app.use(cors());

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  createOrder,
  getOrders,
  validate_user,
  getUserOrders,
  deleteOrder,
};