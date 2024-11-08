import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Welcome from './components/welcome'; 
import Order from './components/orders/create-order'; 
import UserOrders from './components/orders/user-orders'; 
import CourierOrders from './components/courier/CourierOrders'; 
// import AuthGuard from './components/Authentication/AuthGuard'; 

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
        <Route path="/CourierOrders" element={<CourierOrders />} />


      </Routes>
    </Router>
  );
}

export default App;
