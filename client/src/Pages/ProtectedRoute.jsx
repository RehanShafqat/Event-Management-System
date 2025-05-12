// components/ProtectedRoute.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useSelector(
    (state) => state.authentication
  );


  if (!loading && !user) {
    return <Navigate to="/" replace />;
  }


  if (user && requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }


  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
