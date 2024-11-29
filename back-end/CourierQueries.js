const pool = require('./db'); // Adjust the path as necessary
const bcrypt = require('bcryptjs');

const createCourier = async (request, response) => {
    const { name, email, password, phone } = request.body; // Include phone in the destructuring
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      pool.query(
        'INSERT INTO couriers (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, email, hashedPassword, phone], // Pass phone as the third parameter
        (error, results) => {
          if (error) {
            console.error("Database insert error:", error);
            return response.status(500).json({ error: 'Error creating courier' });
          }
          response.status(201).json({
            message: 'Courier created successfully',
            courierId: results.rows[0].id,
          });
        }
      );
    } catch (error) {
      console.error("Hashing error:", error);
      response.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const getCouriers = (request, response) => {
    pool.query('SELECT * FROM couriers ORDER BY id ASC', (error, results) => {
      if (error) {
        console.error("Database fetch error:", error);
        return response.status(500).json({
          error: 'Error fetching Couriers'
        });
      }
      response.status(200).json(results.rows);
    });
  };
  
  // Endpoint to fetch all couriers
  const getCouriersNames = (request, response) => {
    pool.query('SELECT id, name FROM couriers ORDER BY name ASC', (error, results) => {
      if (error) {
        console.error("Database fetch error:", error);
        return response.status(500).json({
          error: 'Error fetching couriers'
        });
      }
      response.status(200).json(results.rows);  // returns an array of couriers with their IDs and names
    });
  };
  
  
  
  
  const loginCourier = async (request, response) => {
    const {
      email,
      password
    } = request.body;
  
    pool.query(
      'SELECT * FROM couriers WHERE email = $1',
      [email],
      async (error, results) => {
        if (error) {
          return response.status(500).json({
            error: 'Database error'
          });
        }
        if (results.rows.length > 0) {
          const admin = results.rows[0];
          const isMatch = await bcrypt.compare(password, admin.password);
          if (isMatch) {
            response.status(200).json({
              message: 'Login successful',
              admin: {
                id: admin.id,
                name: admin.name,
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
  
  const validate_courier = async (req, res) => {
    const email = req.body.email;
  
    if (!email) {
      return res.status(400).json({ message: 'Invalid email' });
    }
  
    try {
      const result = await pool.query('SELECT * FROM couriers WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        return res.status(200).json({ valid: true });
      } else {
        return res.status(404).json({ valid: false });
      }
    } catch (error) {
      console.error('Error validating courier:', error.stack);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = {
    createCourier,
    getCouriers,
    getCouriersNames,
    validate_courier,
    loginCourier,
  };