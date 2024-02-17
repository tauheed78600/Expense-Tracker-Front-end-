// PrivateRoute.js
import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
