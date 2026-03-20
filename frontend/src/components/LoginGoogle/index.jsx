import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";

function LoginGoogle({ redirect }) {
  const navigate = useNavigate();
  const handleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const message = await authLoginGoogle({ token });
      if (message.errCode === 0) {
        if (message.user.role === "ADMIN") {
          navigate("/DashBoard");
        } else {
          navigate(redirect);
          window.location.reload();
        }
      } else {
        console.log("Lỗi khi tạo phiên đăng nhập!");
      }
    } catch (error) {
      console.log("Lỗi khi tọa phiên đăng nhập: ", error);
    }
  };

  const handleError = () => {
    console.error("Lỗi khi đăng nhập!");
  };

  return (
    <div className="flex items-center justify-center gap-[1rem] mt-[2rem] md:mt-[5rem]">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}

export default LoginGoogle;
