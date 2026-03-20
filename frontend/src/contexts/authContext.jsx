import { createContext, useEffect, useState } from "react";
import axiosInstance from "../configs/axiosInstance";
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/auth/me");
      if (res.status === 200) {
        setUser(res.data.user);
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, fetchUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
