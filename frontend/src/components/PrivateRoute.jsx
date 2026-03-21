import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

function PrivateRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();
  console.log("user.role:", user?.role);
  console.log("allowedRoles:", allowedRoles);
  console.log("includes:", allowedRoles?.includes(user?.role));
  if (isLoading) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={"/manage/login"} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={"/403"} replace />;
  }

  return children;
}

export default PrivateRoute;
