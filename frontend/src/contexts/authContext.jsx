import { createContext, useEffect, useState } from "react";
import axiosInstance from "../configs/axiosInstance";
import { toast } from "react-toastify";
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

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/api/v1/login", {
        email: email,
        password: password,
      });
      if (res.status === 200) {
        await fetchUser();
        return true;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      const res = await axiosInstance.post("/api/v1/logout");
      if (res.status === 200) {
        setUser(null);
        return true;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, fetchUser, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
