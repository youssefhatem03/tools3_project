import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Welcome from './components/welcome'; // Ensure this is the correct path
import Order from './components/orders/create-order'; // Import the new component
import UserOrders from './components/orders/user-orders'; // Import the new component
// import AuthGuard from './components/Authentication/AuthGuard'; // Import the new component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Registration />} /> {/* Set registration as the default page */}
        <Route path="/" element={<Login />} /> {/* Set registration as the default page */}
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/create-order" element={<Order />} />
        <Route path="/user-orders" element={<UserOrders />} />


      </Routes>
    </Router>
  );
}

export default App;
