//index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queries');
const port = 3000;

// Import and configure CORS
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  credentials: true, // Allow credentials (cookies, headers, etc.)
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

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

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);
app.post('/login', db.loginUser);


app.post('/create-order', db.createOrder);
app.get('/orders', db.getOrders);
app.get('/ordersWithCouriers', db.getOrdersWithCouriers);
app.get('/user-orders/:userId', db.getUserOrders);
app.put('/orders/:id/pickup', db.updateOrderStatus);
app.delete('/orders/:id', db.deleteOrder);
app.post('/validate-user' , db.validate_user);


app.post('/create-courier', db.createCourier);
app.post('/login-courier', db.loginCourier);
app.post('/validate-courier', db.validate_courier);
app.get('/couriers', db.getCouriers);
app.put('/orders/:id/accept', db.assignCourierToOrder);


app.post('/create-admin', db.createAdmin);
app.post('/validate-admin', db.validate_admin);
app.get('/admins', db.getAdmins);
app.post('/login-admin', db.loginAdmin);
// Route to fetch all couriers for reassignment
app.get('/couriersNames', db.getCouriersNames);

// Route to reassign a courier to an order
app.put('/orders/:id/reassign', db.reassignCourierToOrder);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
  })