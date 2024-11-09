// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = !!localStorage.getItem('adminId'); // Check if admin ID is stored in localStorage

  return isAdminLoggedIn ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedRoute;
