import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Form from "./Form";
import { Link } from "react-router";

function LoginUser() {
  return (
    <div className="fixed inset-0 w-full h-[100vh] flex justify-center items-center linearLogin">
      <Link
        to={`/`}
        className="absolute top-[2rem] right-[2rem] w-[4rem] h-[4rem] flex justify-center items-center bg-[#dedede] rounded-[.3rem] hover:bg-[#ccc] hv-linear"
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="text-[2rem] text-[#656565]"
        />
      </Link>
      <Form />
    </div>
  );
}

export default LoginUser;
