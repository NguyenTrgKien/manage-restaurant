import { useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../../configs/axiosInstance";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    let isRequest = true;
    if (email === "") {
      setError((prev) => ({
        ...prev,
        email: "Vui lòng nhập email!",
      }));
      isRequest = false;
    }

    if (password === "") {
      setError((prev) => ({
        ...prev,
        password: "Vui lòng nhập mật khẩu!",
      }));
      isRequest = false;
    }

    if (!isRequest) {
      return;
    }

    try {
      const res = await axiosInstance.post("/api/v1/login", {
        email: email,
        password: password,
      });

      if (res.status === 200) {
        navigate("/manage");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-[2.2rem] font-bold text-center mb-6">
          Đăng nhập Admin
        </h2>

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg h-[4.5rem] px-8 focus:outline-none focus:border focus:border-blue-700"
            />
            <p className="text-red-500 mt-1.5">{error.email}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg h-[4.5rem] px-8 focus:outline-none focus:border focus:border-blue-700"
            />
            <p className="text-red-500 mt-1.5">{error.password}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white h-[4.5rem] px-8 rounded-lg hover:bg-blue-600 transition"
          >
            Đăng nhập
          </button>
          <a
            href="#"
            className="block text-center text-blue-500 hover:text-blue-700"
          >
            Liên hệ IT suport
          </a>
        </form>
      </div>
    </div>
  );
}

export default LoginAdmin;
