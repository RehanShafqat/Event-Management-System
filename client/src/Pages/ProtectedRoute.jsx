// components/ProtectedRoute.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useSelector(
    (state) => state.authentication
  );

  if (!user.role) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />; //I have to create a page for unauthorized access
  }

  return children;
};

export default ProtectedRoute;
