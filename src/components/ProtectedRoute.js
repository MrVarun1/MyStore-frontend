import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, redirect, isPublicPage = false }) => {
  const token = Cookies.get("jwt_token");

  if (isPublicPage) {
    return token ? <Navigate to={redirect} replace /> : <>{children}</>;
  }

  return token ? <>{children}</> : <Navigate to={redirect} replace />;
};

export default ProtectedRoute;
