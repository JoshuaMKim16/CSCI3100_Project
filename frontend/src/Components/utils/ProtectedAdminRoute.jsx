import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user || !user.is_admin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedAdminRoute;