import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Không có context!");
  }
  return context;
};
