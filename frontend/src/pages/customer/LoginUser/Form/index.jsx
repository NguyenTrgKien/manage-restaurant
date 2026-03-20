import { useState } from "react";
import imgLogin from "../../../../assets/image/resgister.png";
import resgister from "../../../../assets/image/register.png";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import LoginGoogle from "../../../../components/LoginGoogle";

function Form() {
  const navigate = useNavigate();
  const location = useLocation(); // Dùng để lấy đường dẫn hiện tại và tham số trong đường dẫn hiện tại
  const [errMessage, setErrMessage] = useState("");
  const [currentForm, setCurrentForm] = useState(true);
  const searchParams = new URLSearchParams(location.search); // Giúp tạo truy vấn, cập nhật, và xóa các tham số url
  const [message, setMessage] = useState("");
  const [valueLogin, setvalueLogin] = useState({
    email: "",
    password: "",
  });
  const [valueRegister, setValueRegister] = useState({
    fullName: "",
    phoneNumber: "",
    emailRegister: "",
    passwordRegister: "",
    role: "user",
  });
  const redirect = searchParams.get("redirect") || "/";

  const handleChangeInputLogin = (name, value) => {
    setvalueLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeInputRegister = ({ target }) => {
    const { name, value } = target;
    if (name === "passwordRepeat") {
      if (value !== valueRegister.passwordRegister) {
        setMessage("Mật khẩu nhập lại không đúng!");
        return;
      }
    }
    setValueRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const { fullName, phoneNumber, passwordRegister, emailRegister } =
      valueRegister;
    if (!fullName || !phoneNumber || !passwordRegister || !emailRegister) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    const formData = new FormData();
    Object.entries(valueRegister).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const message = await handlRegister(formData);
      if (message.errCode === 0) {
        setCurrentForm(true);
      } else {
        setMessage(message.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const message = await loginUser(valueLogin);
      if (message.errCode === 0) {
        if (message.user.role === "Admin") {
          navigate("/manage");
        } else {
          navigate(redirect);
          window.location.reload();
        }
      } else {
        setErrMessage(message.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-[90%] md:w-[72%] h-[58rem] md:h-[68rem] rounded-[2rem] shadow-2xl bg-[#fff] overflow-hidden">
      <div
        className={`${currentForm ? "translate-x-[0] opacity-[1] z-[999] loginClippath" : "loginClippathChange translate-x-[100%] opacity-0 z-0"} w-[55%] h-full absolute justify-center items-center left-0 top-0 bg-[#fff0] transition-all duration-[.8s] hidden lg:flex`}
      >
        <img
          src={imgLogin}
          alt=""
          className="w-[100%] h-[100%] rounded-[2rem] "
        />
      </div>
      <div
        className={`${currentForm ? "translate-x-[0] opacity-0 z-0" : "translate-x-[100%] opacity-[1] z-[999]"} w-[50%] h-full absolute justify-center items-center left-0 top-0 bg-[#fff0] transition-all duration-[.8s] registerClippath hidden lg:flex`}
      >
        <img
          src={resgister}
          alt=""
          className="w-[100%] h-[100%] rounded-[2rem]"
        />
      </div>

      <div
        className={`${currentForm ? "translate-x-[0] opacity-[1] z-[999]" : "translate-x-[-100%] opacity-0 z-0"} top-0 right-0 absolute w-full lg:w-[45%] h-full bg-[#ffffff00] p-[2rem] md:p-[4rem] transition-all duration-[.8s]`}
      >
        <div className="text-[2.4rem] md:text-[3rem] font-bold text-center colorTitleLogin mb-[2rem]">
          Đăng Nhập
        </div>
        <form onSubmit={handleLogin}>
          <div className="w-full">
            <label htmlFor="email" className="block mb-[.5rem] text-[#000]">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={valueLogin.email}
              placeholder="Nhập email của bạn..."
              className="w-full h-[5rem] border-[.1rem] border-[#000] rounded-[.4rem] text-[#000] pl-[1.5rem]"
              onChange={(e) => {
                handleChangeInputLogin(e.target.name, e.target.value);
              }}
            />
          </div>
          <div className="w-full mt-[1rem] md:mt-[2.8rem]">
            <label htmlFor="password" className="block mb-[.5rem] text-[#000]">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={valueLogin.password}
              id="password"
              placeholder="Nhập mật khẩu của bạn..."
              className="w-full h-[5rem] border-[.1rem] border-[#000] text-[#000] rounded-[.4rem] pl-[1.5rem]"
              onChange={(e) => {
                handleChangeInputLogin(e.target.name, e.target.value);
              }}
            />
          </div>
          <div className="text-[red] mt-[2rem] md:mt-[4rem]">
            {errMessage !== "" && errMessage}
          </div>
          <button
            type="submit"
            className="w-full h-[5rem] flex justify-center items-center rounded-[.5rem] mt-[.8rem] cursor-pointer bg-gradient-to-r from-[#00c6fb] to-[#005bea] text-white hover:bg-gradient-to-r hover:from-[#005bea] hover:to-[#00c6fb] hover:scale-[1.05] hv-linear"
          >
            Đăng nhập
          </button>
          <div className="text-center mt-[1rem] text-[#000]">
            Chưa có tài khoảng?{" "}
            <span
              className="text-[#171bff] cursor-pointer"
              onClick={() => setCurrentForm(false)}
            >
              Đăng kí
            </span>
          </div>
        </form>
        <LoginGoogle redirect={redirect} />
      </div>
      <div
        className={`${currentForm ? "translate-x-[0] opacity-0 z-0" : "lg:translate-x-[-100%] lg:opacity-[1] z-[999]"} top-0 absolute right-0 w-full lg:w-[50%] h-full bg-[#ffffff00] p-[2rem] md:p-[4rem] transition-all duration-[.8s]`}
      >
        <div className="text-[2.4rem] md:text-[3rem] font-bold text-center colorTitleRegister mb-[2rem]">
          Đăng Ký
        </div>
        <form onSubmit={handleSubmitRegister}>
          <div className="flex items-center gap-[1rem] mb-[1rem] md:mb-[2rem]">
            <div className="w-full">
              <label
                htmlFor="fullName"
                className="block mb-[.5rem] text-[#000]"
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={valueRegister.fullName}
                placeholder="Tên đăng nhập ủa bạn..."
                className="w-full h-[5rem] border-[.1rem] border-[#000] rounded-[.4rem] text-[#000] pl-[1.5rem]"
                onChange={(e) => handleChangeInputRegister(e)}
              />
            </div>
          </div>
          <div className="w-full">
            <label
              htmlFor="emailRegister"
              className="block mb-[.5rem] text-[#000]"
            >
              Email
            </label>
            <input
              type="email"
              name="emailRegister"
              id="emaemailRegisteril"
              value={valueRegister.emailRegister}
              placeholder="Nhập emailRegister của bạn..."
              className="w-full h-[5rem] border-[.1rem] border-[#000] rounded-[.4rem] text-[#000] pl-[1.5rem]"
              onChange={(e) => handleChangeInputRegister(e)}
            />
          </div>
          <div className="w-full mt-[1rem] md:mt-[2rem]">
            <label
              htmlFor="phoneNumber"
              className="block mb-[.5rem] text-[#000]"
            >
              Số điện thoại
            </label>
            <input
              type="phoneNumber"
              name="phoneNumber"
              id="phoneNumber"
              value={valueRegister.phoneNumber}
              placeholder="Nhập sđt của bạn..."
              className="w-full h-[5rem] border-[.1rem] border-[#000] rounded-[.4rem] text-[#000] pl-[1.5rem]"
              onChange={(e) => handleChangeInputRegister(e)}
            />
          </div>
          <div className="w-full mt-[1rem] md:mt-[2rem]">
            <label
              htmlFor="passwordRegister"
              className="block mb-[.5rem] text-[#000]"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              name="passwordRegister"
              id="passwordRegister"
              value={valueRegister.passwordRegister}
              placeholder="Nhập mật khẩu của bạn..."
              className="w-full h-[5rem] border-[.1rem] border-[#000] text-[#000] rounded-[.4rem] pl-[1.5rem]"
              onChange={(e) => handleChangeInputRegister(e)}
            />
          </div>
          <p className="text-[red] mt-[3rem]">{message}</p>
          <button
            type="submit"
            className="w-full h-[4.5rem] flex justify-center items-center rounded-[.5rem] mt-[.5rem]  bg-gradient-to-r from-[#efcb16] to-[#ff3236] text-white hover:bg-gradient-to-r hover:from-[#ff3236] hover:to-[#efcb16] hover:scale-[1.05] hv-linear cursor-pointer"
          >
            Đăng ký
          </button>
          <div className="text-center mt-[1rem] text-[#000]">
            Đã có tài khoảng?{" "}
            <span
              className="text-[#171bff] cursor-pointer"
              onClick={() => setCurrentForm(true)}
            >
              Đăng nhập
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;
