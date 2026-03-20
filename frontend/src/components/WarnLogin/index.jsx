import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function WarnLogin({ setShowWarnLogin, pathRedirect, info }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#5c5c5c2b] z-[999]">
      <div className="relative w-[90%] md:w-auto h-auto p-[4rem] rounded-[1rem] bg-[#fff] shadow-2xl">
        <div className="text-[1.8rem] text-[#ff9800] text-center">
          Bạn chưa đăng nhập! Vui lòng đăng nhập để {info}.
        </div>
        <span
          className="absolute top-[1rem] w-[2rem] h-[2rem] rounded-[.3rem] bg-[#e8e8e8] right-[1rem] flex justify-center items-center hover:bg-[red] group transition-all duration-[.25s]"
          onClick={() => setShowWarnLogin(false)}
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="text-[#616161] group-hover:text-[#fff] transition-all duration-[.25s]"
          />
        </span>
        <div className="flex items-center justify-center gap-[1rem] mt-[2rem]">
          <button
            className="w-auto px-[2rem] h-[4rem] bg-[#6c757d] rounded-[.5rem] transition-all duration-[.25s] select-none cursor-pointer text-[#fff]"
            onClick={() => setShowWarnLogin(false)}
          >
            Không
          </button>
          <Link
            to={`/login?redirect=${pathRedirect}`}
            className="w-auto px-[2rem] h-[4rem] bg-[#28a745] rounded-[.5rem] hover:bg-[red] text-[#fff] transition-all duration-[.25s] select-none cursor-pointer flex justify-center items-center"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WarnLogin;
