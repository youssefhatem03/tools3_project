import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Order from './components/user/create-order'; 
import UserOrders from './components/user/user-orders'; 
import CourierOrders from './components/courier/CourierOrders'; 
import MyOrdersCourier from './components/courier/myOrders-Courier';
import LoginAdmin from './components/admin/login-admin'; 
import OrderManagement from './components/admin/OrderManagement'; 
import ProtectedRoute from './components/Authentication/ProtectedRoute'; 
import LoginCourier from './components/courier/login-courier'; 
import AdminOrders from './components/admin/ReassignOrders'; 
import NavbarHook from "./assets/navbarhooks/NavbarHook"

// import AuthGuard from './components/Authentication/AuthGuard'; 

function App() {
  return (
    <Router>
    <NavbarHook />
<main className="main-content">

      <Routes>
  
        <Route path="/register" element={<Registration />} /> {/* Set registration as the default page */}
        <Route path="/" element={<Login />} /> {/* Set registration as the default page */}
        <Route path="/login" element={<Login />} />
        <Route path="/create-order" element={<Order />} />
        <Route path="/user-orders" element={<UserOrders />} />
        <Route path="/CourierOrders" element={<CourierOrders />} />
        <Route path="/myOrders-courier" element={<MyOrdersCourier />} />
        <Route path="/login-courier" element={<LoginCourier />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/OrderManagement" element={<OrderManagement />} />
        <Route path="/reassignOrders" element={<AdminOrders />} />
        <Route
          path="/OrderManagement"
          element={
            <ProtectedRoute>
              <OrderManagement />
            </ProtectedRoute>
          }
        />

      </Routes>
      </main>
    </Router>
  );
}

export default App;
