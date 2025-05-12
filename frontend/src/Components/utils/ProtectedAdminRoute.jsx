import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

// Admin Route Protection
const ProtectedAdminRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user || !user.is_admin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;