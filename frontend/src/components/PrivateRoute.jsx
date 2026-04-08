import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

function PrivateRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to={"/manage/login"} replace state={{ from: location }} />;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={"/manage/login"} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={"/403"} replace />;
  }

  return children;
}

export default PrivateRoute;
