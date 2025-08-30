import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAuthenticated(true);
        setIsAdmin(payload.isAdmin || false);
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
