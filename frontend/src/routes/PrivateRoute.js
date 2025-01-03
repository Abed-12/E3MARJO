import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, isAuthenticated, role, allowedRoles }) => {
  // Check if user is authenticated and has a valid role
  if (!(isAuthenticated === null || role === null) && (!isAuthenticated || !allowedRoles.includes(role))) {
    const fallbackPath = role ? `/${role}-login` : '/supplier-login';
    return <Navigate to={fallbackPath} replace={false} />;
  }

  return element;
};

export default PrivateRoute;
