// AuthGuard.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const userId = localStorage.getItem('userId'); // Adjust this to match how you store the user ID

    // If no userId is found, redirect to the login page
    if (!userId) {
        return <Navigate to="/login" replace />;
    }

    // If userId exists, render the child components
    return children;
};

export default AuthGuard;
