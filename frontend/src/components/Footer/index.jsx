// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import DiliFood from '../../assets/image/logo.png';
// import {faFacebook, faFacebookMessenger, faSquareInstagram, faTiktok} from '@fortawesome/free-brands-svg-icons';

// function Footer() {
//     return (
//         <div className="w-full h-auto grid md:grid-cols-3 lg:grid-cols-4 gap-[2rem] px-[2rem] md:px-[5rem] lg:px-[10rem] py-[4rem] bg-[#2e2e2ed2] mt-[6rem]">
//             <div className="pt-[1rem]">
//                 <img src={DiliFood} alt="booking care" className="w-[20rem] h-[8rem]"/>
//                 <p className="text-[1.6rem] text-white pt-[1rem]">Nhà hàng với nhiều dịch vụ và món ăn đa dạng, giúp khách hàng tận hưởng những những phút giây thuyệt vời!</p>
//             </div>
//             <div className="text-white">
//                 <p className="py-[1rem] hover:text-[#9aff9a] hv-linear cursor-pointer">Địa chỉ: đường số 5, KDC Thạnh Mỹ, Q.Cái Răng, Tp.Cần Thơ</p>
//                 <p className="py-[1rem] hover:text-[#9aff9a] hv-linear cursor-pointer">Hotline: 0357124853</p>
//                 <p className="py-[1rem] hover:text-[#9aff9a] hv-linear cursor-pointer">Email: nguyentrungkien040921@gmail.com</p>
//             </div>
//             <div className="text-white">
//                 <a href="#" className="py-[1rem] block pt-[1rem]">Chính sách bảo mật</a>
//                 <a href="#" className="py-[1rem] block pt-[1rem]">Điều khoảng dịch vụ</a>
//             </div>
//             <div className="relative flex gap-[1.5rem] pt-[1rem] before:content before:absolute before:w-full before:h-[.3rem] before:bg-[cyan] before:top-[6rem]">
//                 <FontAwesomeIcon icon={faFacebook} className="text-[3.5rem] text-white hover:text-[cyan] transition-colors duration-[.25s]"/>
//                 <FontAwesomeIcon icon={faFacebookMessenger} className="text-[3.5rem] text-white hover:text-[cyan] transition-colors duration-[.25s]"/>
//                 <FontAwesomeIcon icon={faSquareInstagram} className="text-[3.5rem] text-white hover:text-[cyan] transition-colors duration-[.25s]"/>
//                 <FontAwesomeIcon icon={faTiktok} className="text-[3.5rem] text-white hover:text-[cyan] transition-colors duration-[.25s]"/>
//             </div>
//         </div>
//      );
// }

// export default Footer;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../assets/image/logo.png";
import Google from "../../assets/image/google.png";
import Chplay from "../../assets/image/chplay.png";
import {
  faGoogle,
  faInstagram,
  faSquareFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="w-full h-auto] bg-[#2d3748] px-[1.5rem] md:px-[10rem] mt-[6rem] md:pt-[8rem] py-[4rem]">
      <div className="flex justify-between items-center">
        <div className="min-w-[20%] text-start pb-[1rem] md:pb-[2rem] border-b-[.1rem] border-[#535353]">
          <img
            src={Logo}
            className="w-[7rem] h-[1.8rem] md:w-[15rem] md:h-[6rem] object-cover"
          />
        </div>
        <div className="min-w-[20%] text-start pb-[1rem] md:pb-[2rem] border-b-[.1rem] border-[#535353] flex items-center gap-3 ">
          <Link
            to={`https://www.facebook.com/profile.php?id=100029756161612&locale=vi_VN`}
            target="_blank"
            className=""
          >
            <FontAwesomeIcon
              icon={faSquareFacebook}
              className="text-white text-[2rem] md:text-[3rem] hover:text-primary  shadow-app-footer"
            />
          </Link>
          <Link to={`https://www.instagram.com/`} target="_blank">
            <FontAwesomeIcon
              icon={faInstagram}
              className="text-white text-[2rem] md:text-[3rem] hover:text-primary shadow-app-footer"
            />
          </Link>
          <FontAwesomeIcon
            icon={faTwitter}
            className="text-white text-[2rem] md:text-[3rem] hover:text-primary shadow-app-footer"
          />

          <FontAwesomeIcon
            icon={faGoogle}
            className="text-white text-[2rem] md:text-[3rem] hover:text-primary shadow-app-footer"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-8 pt-[4rem] pb-[2.5rem] md:pb-[5rem] border-b-[.1rem] border-[#535353]">
        <div className="flex flex-col gap-y-[.3rem]">
          <h4 className="text-[1.5rem] md:text-[1.8rem] text-[#ccc] font-semibold mb-4">
            COMPANY
          </h4>
          <Link
            to={`/about`}
            className="text-[1.4rem] text-white hoverFooter transition-all duration-[.25s] select-none"
          >
            About
          </Link>
          <Link
            to={`/contact`}
            className="text-[1.4rem] text-white hoverFooter transition-all duration-[.25s] select-none"
          >
            Contact
          </Link>
        </div>
        <div className="flex flex-col gap-y-[.3rem]">
          <h4 className="text-[1.5rem] md:text-[1.8rem] text-[#ccc] font-semibold mb-4">
            SUPORT
          </h4>
          <span className="text-[1.4rem] text-white hoverFooter transition-all duration-[.25s] select-none">
            Contact support
          </span>
          <span className="text-[1.4rem] text-white hoverFooter transition-all duration-[.25s] select-none">
            Help center
          </span>
          <span className="text-[1.4rem] text-white hoverFooter transition-all duration-[.25s] select-none">
            Suported devices
          </span>
          <span className="text-[1.4rem] text-white hoverFooter transition-all duration-[.25s] select-none">
            Activate Your Device
          </span>
        </div>
        <div className="flex flex-col gap-y-[.3rem]">
          <h4 className="text-[1.5rem] md:text-[1.8rem] text-[#ccc] font-semibold mb-4">
            PATERNTS
          </h4>
          <span className="text-[1.4rem] text-white hoverFooter transition-all duration-[.25s] select-none">
            Advertise with us
          </span>
          <span className="text-[1.4rem] text-white hoverFooter transition-all duration-[.25s] select-none">
            Partners with us
          </span>
        </div>
        <div className="flex flex-col gap-y-[.3rem]">
          <h4 className="text-[1.5rem] md:text-[1.8rem] text-[#ccc] font-semibold mb-4">
            GET THE APP
          </h4>
          <span className="text-[1.4rem] text-white hoverFooter transition-all duration-[.25s] select-none">
            iOS
          </span>
          <span className="text-[1.4rem] text-white hoverFooter transition-all duration-[.25s] select-none">
            Roku
          </span>
          <span className="text-[1.4rem] text-white hoverFooter transition-all duration-[.25s] select-none">
            Amazon file
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 pt-8 md:pt-16">
        <div className="flex justify-center items-center gap-[.5rem] px-10 py-4 border-[.1rem] border-[#535353] rounded-[.4rem] hover:cursor-pointer hover:border-primary transition-all shadow-app-footer">
          <img
            src={Google}
            className="w-[2rem] h-[2rem] md:w-[3.5rem] md:h-[3.5rem]"
          />
          <span className="text-[1.5rem] md:text-[2.2rem] font-bold text-white">
            Google
          </span>
        </div>
        <div className="flex justify-center items-center gap-[.5rem] px-10 py-4 border-[.1rem] border-[#535353] rounded-[.4rem] hover:cursor-pointer hover:border-primary shadow-app-footer">
          <img
            src={Chplay}
            className="w-[2rem] h-[2rem] md:w-[3.5rem] md:h-[3.5rem]"
          />
          <span className="text-[1.5rem] md:text-[2.2rem] font-bold text-white">
            Google
          </span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
