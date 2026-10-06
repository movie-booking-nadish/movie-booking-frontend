import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import NotAllowed from '../pages/NotAllowed';

interface RoleRouteProps {
  allowedRoles: Role[];
  children?: React.ReactNode;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <NotAllowed />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleRoute;
