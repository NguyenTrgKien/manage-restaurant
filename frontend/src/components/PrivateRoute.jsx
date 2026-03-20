import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();

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

  if (!["ADMIN", "staff"].includes(user.role)) {
    return <Navigate to={"/"} />;
  }

  return children;
}

export default PrivateRoute;
