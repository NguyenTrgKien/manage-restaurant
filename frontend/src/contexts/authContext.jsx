import { createContext, useEffect, useState } from "react";
import axiosInstance from "../configs/axiosInstance";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
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

  const logout = async () => {
    try {
      await axiosInstance.post("/api/v1/logout");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUser(null);
      localStorage.removeItem("access_token");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, fetchUser, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
