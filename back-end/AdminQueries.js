const pool = require('./db'); 
const bcrypt = require('bcryptjs');

const createAdmin = async (request, response) => {
    const { name, email, password } = request.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      pool.query(
        'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING id',
        [name, email, hashedPassword],
        (error, results) => {
          if (error) {
            console.error("Database insert error:", error);
            return response.status(500).json({ error: 'Error creating courier' });
          }
          response.status(201).json({
            message: 'Admin created successfully',
            adminId: results.rows[0].id,
          });
        }
      );
    } catch (error) {
      console.error("Hashing error:", error);
      response.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  
  // Update an order status and assign courier_id
  const assignCourierToOrder = (request, response) => {
    const orderId = parseInt(request.params.id);
    const { courier_id } = request.body; // Get courier_id from request body
  
    if (isNaN(orderId) || isNaN(courier_id)) {
      return response.status(400).json({ error: 'Invalid order ID or courier ID' });
    }
  
    pool.query(
      'UPDATE orders SET status = $1, courier_id = $2 WHERE id = $3',
      ['Picked Up', courier_id, orderId],
      (error, results) => {
        if (error) {
          console.error("Database update error:", error);
          return response.status(500).json({ error: 'Error updating order status' });
        }
        response.status(200).json({ message: 'Order accepted and courier assigned successfully' });
      }
    );
  };
  
  
  
  
  
  // Create a new Admin with hashed password
  
  const getAdmins = (request, response) => {
    pool.query('SELECT * FROM admins ORDER BY id ASC', (error, results) => {
      if (error) {
        console.error("Database fetch error:", error);
        return response.status(500).json({
          error: 'Error fetching Admins'
        });
      }
      response.status(200).json(results.rows);
    });
  };
  
  
  // Backend endpoint to validate if an email is in the admins table
  const validate_admin = async (req, res) => {
    const email = req.body.email;
  
    if (!email) {
      return res.status(400).json({ message: 'Invalid email' });
    }
  
    try {
      const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        return res.status(200).json({ valid: true });
      } else {
        return res.status(404).json({ valid: false });
      }
    } catch (error) {
      console.error('Error validating admin:', error.stack);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  const loginAdmin = async (request, response) => {
    const {
      email,
      password
    } = request.body;
  
    pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [email],
      async (error, results) => {
        if (error) {
          return response.status(500).json({
            error: 'Database error'
          });
        }
        if (results.rows.length > 0) {
          const courier = results.rows[0];
          const isMatch = await bcrypt.compare(password, courier.password);
          if (isMatch) {
            response.status(200).json({
              message: 'Login successful',
              courier: {
                id: courier.id,
                name: courier.name,
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
  
  // Endpoint to reassign a courier to an order
  const reassignCourierToOrder = (request, response) => {
    const orderId = parseInt(request.params.id);
    const { courier_id } = request.body;
  
    // Validation checks
    if (isNaN(orderId) || isNaN(courier_id)) {
      return response.status(400).json({ error: 'Invalid order ID or courier ID' });
    }
  
    pool.query(
      'UPDATE orders SET courier_id = $1, status = $2 WHERE id = $3',
      [courier_id, 'Reassigned', orderId],
      (error, results) => {
        if (error) {
          console.error("Database update error:", error);
          return response.status(500).json({ error: 'Error reassigning courier to order' });
        }
        response.status(200).json({ message: 'Courier reassigned successfully' });
      }
    );
  };
  

  module.exports = {
    createAdmin,
    assignCourierToOrder,
    getAdmins,
    validate_admin,
    loginAdmin,
    reassignCourierToOrder,
  };