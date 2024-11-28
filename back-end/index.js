//index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
// const db = require('./queries');
const user = require('./UserQueries');
const courier = require('./CourierQueries');
const admin = require('./AdminQueries');
const order = require('./OrderQueries');
const port = 3000;

// Import and configure CORS
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  credentials: true, // Allow credentials (cookies, headers, etc.)
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

const bcrypt = require('bcryptjs');

bcrypt.hash('password123', 10, function(err, hash) {
    if (err) throw err;
    console.log(hash);
});



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.get('/', (request, response) => {
  response.json({
    info: 'Node.js, Express, and Postgres API'
  });
});

// User Routes
app.get('/users', user.getUsers);
app.get('/users/:id', user.getUserById);
app.post('/users', user.createUser);
app.put('/users/:id', user.updateUser);
app.delete('/users/:id', user.deleteUser);
app.post('/login', user.loginUser);
app.post('/validate-user' , user.validate_user);
app.delete('/CancelOrder/:id' , user.CancelOrder);


// Order Routes
app.post('/create-order', order.createOrder);
app.get('/orders', order.getOrders);
app.get('/orders/pending', order.getPendingOrders);
app.get('/orders/assigned/:courierId', order.getAssignedOrders);
app.get('/ordersWithCouriers', order.getOrdersWithCouriers);
app.get('/user-orders/:userId', order.getUserOrders);
app.put('/orders/:id/pickup', order.updateOrderStatus);
app.delete('/orders/:id', order.deleteOrder);


// Courier Routes
app.post('/create-courier', courier.createCourier);
app.post('/login-courier', courier.loginCourier);
app.post('/validate-courier', courier.validate_courier);
app.get('/couriers', courier.getCouriers);
app.get('/couriersNames', courier.getCouriersNames);


// Admin Routes
app.post('/create-admin', admin.createAdmin);
app.post('/validate-admin', admin.validate_admin);
app.get('/admins', admin.getAdmins);
app.post('/login-admin', admin.loginAdmin);
app.put('/orders/:id/accept', admin.assignCourierToOrder);
app.put('/orders/:id/reassign', admin.reassignCourierToOrder);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
  })