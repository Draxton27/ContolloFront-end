import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// ProtectedRoute component to protect routes that require authentication
const ProtectedRoute = ({ isAuthenticated }) => {
    // If the user is authenticated, render the child routes (Outlet)
    // Otherwise, redirect to the login page ("/")
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
