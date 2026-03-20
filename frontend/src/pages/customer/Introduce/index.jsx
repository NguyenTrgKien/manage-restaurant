import { useEffect, useState } from "react";
import res from "../../../assets/image/resgister.png";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

function Introduce() {
  const [login, setLogin] = useState({});

  useEffect(() => {
    const isLogin = async () => {
      try {
        const message = await checkLogin();
        if (message.errCode === 0) {
          setLogin(message.user);
        } else {
          setLogin({});
        }
      } catch (error) {
        setLogin({});
      }
    };
    isLogin();
  }, []);

  return (
    <div className="w-full">
      <Header login={login} setLogin={setLogin} isBg={true} isShowCart={true} />
      <div className="mx-auto w-[50%] pt-[9.5rem]">
        <h2 className="text-[3.4rem] font-bold text-center text-green-800 mb-8">
          Về Chúng Tôi
        </h2>
        <p className="text-gray-600 text-[1.5rem] text-center leading-relaxed">
          Chào mừng bạn đến với{" "}
          <span className="font-bold text-orange-500">Nhà Hàng DILIFOOD</span> –
          nơi tinh hoa ẩm thực gặp gỡ không gian ấm cúng. Chúng tôi cam kết mang
          đến những món ăn ngon, nguyên liệu tươi sạch và dịch vụ tận tâm.
        </p>

        <div className="mt-10 flex flex-col lg:flex-row items-center gap-10">
          <img
            src={res}
            alt="Nhà hàng"
            className="h-[40rem] rounded-lg shadow-lg"
          />
          <div>
            <h2 className="text-[2rem] font-bold text-gray-600">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <p className="text-gray-700 mt-3 leading-relaxed">
              Chúng tôi mong muốn trở thành địa điểm ẩm thực hàng đầu, mang đến
              trải nghiệm tuyệt vời cho khách hàng thông qua hương vị tuyệt hảo
              và không gian sang trọng.
            </p>
          </div>
        </div>

        <div className="mt-[3rem] bg-gray-100 p-8 rounded-lg shadow-md">
          <h2 className=" font-semibold text-gray-800 text-center">
            Giá Trị Cốt Lõi
          </h2>
          <ul className="list-none mt-4 space-y-4 text-gray-700">
            <li className="flex items-center gap-3">
              <span className="text-orange-500">✔</span>
              Chất lượng thực phẩm luôn được đặt lên hàng đầu.
            </li>
            <li className="flex items-center gap-3">
              <span className="text-orange-500">✔</span>
              Dịch vụ tận tâm, khách hàng là trung tâm.
            </li>
            <li className="flex items-center gap-3">
              <span className="text-orange-500">✔</span>
              Không gian ấm cúng, thiết kế sang trọng.
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Introduce;
