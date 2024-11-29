const pool = require('./db'); // Adjust the path as necessary
const bcrypt = require('bcryptjs');

// Utility function for sending error responses
const handleError = (error, response, message = 'Internal server error', statusCode = 500) => {
  console.error(`${message}:`, error.stack || error);
  response.status(statusCode).json({ error: message });
};

// Fetch all users
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) return handleError(error, response, 'Error fetching users');
    response.status(200).json(results.rows);
  });
};

// Fetch a user by ID
const getUserById = (request, response) => {
  const id = parseInt(request.params.id);
  if (isNaN(id)) {
    return response.status(400).json({ error: 'Invalid user ID' });
  }

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) return handleError(error, response, 'Error fetching user');
    if (results.rows.length === 0) {
      return response.status(404).json({ error: 'User not found' });
    }
    response.status(200).json(results.rows[0]);
  });
};

// Create a new user with hashed password
const createUser = async (request, response) => {
  const { name, email, phone, password } = request.body;

  if (!name || !email || !phone || !password) {
    return response.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    pool.query(
      'INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, phone, hashedPassword],
      (error, results) => {
        if (error) return handleError(error, response, 'Error creating user');
        response.status(201).json({ id: results.rows[0].id });
      }
    );
  } catch (error) {
    handleError(error, response, 'Error hashing password');
  }
};

// Update a user by ID
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email, phone, password } = request.body;

  if (isNaN(id)) {
    return response.status(400).json({ error: 'Invalid user ID' });
  }

  pool.query(
    'UPDATE users SET name = $1, email = $2, phone = $3, password = $4 WHERE id = $5',
    [name, email, phone, password, id],
    (error) => {
      if (error) return handleError(error, response, 'Error updating user');
      response.status(200).send(`User updated with ID: ${id}`);
    }
  );
};

// Delete a user by ID
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);
  if (isNaN(id)) {
    return response.status(400).json({ error: 'Invalid user ID' });
  }

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) return handleError(error, response, 'Error deleting user');
    if (results.rowCount === 0) {
      return response.status(404).json({ error: 'User not found' });
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

// Login a user by validating hashed password
const loginUser = async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ error: 'Missing email or password' });
  }

  pool.query('SELECT * FROM users WHERE email = $1', [email], async (error, results) => {
    if (error) return handleError(error, response, 'Error fetching user');
    if (results.rows.length === 0) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      response.status(200).json({
        message: 'Login successful',
        user: { id: user.id, name: user.name },
      });
    } else {
      response.status(401).json({ error: 'Invalid credentials' });
    }
  });
};

// Validate a user by ID
const validate_user = async (req, res) => {
  const userId = parseInt(req.body.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      res.status(200).json({ valid: true });
    } else {
      res.status(404).json({ valid: false });
    }
  } catch (error) {
    handleError(error, res, 'Error validating user');
  }
};

// Cancel an order by ID
const CancelOrder = (request, response) => {
  const orderId = parseInt(request.params.id);
  if (isNaN(orderId)) {
    return response.status(400).json({ error: 'Invalid order ID' });
  }

  pool.query('SELECT status FROM orders WHERE id = $1', [orderId], (error, results) => {
    if (error) return handleError(error, response, 'Error fetching order');
    if (results.rows.length === 0) {
      return response.status(404).json({ error: 'Order not found' });
    }

    const orderStatus = results.rows[0].status;
    if (orderStatus === 'Picked Up') {
      return response.status(400).json({ error: 'Order cannot be cancelled after pickup' });
    }

    pool.query('DELETE FROM orders WHERE id = $1', [orderId], (deleteError) => {
      if (deleteError) return handleError(deleteError, response, 'Error deleting order');
      response.status(200).json({ message: 'Order cancelled successfully' });
    });
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  validate_user,
  CancelOrder,
};
