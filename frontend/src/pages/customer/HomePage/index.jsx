import Header from "../../../components/Header";
import Banner from "../../../components/Banner";
import IntroduceChef from "../../../components/IntroduceChef";
import snow from "../../../assets/image/snow.png";
import SellWell from "../../../components/SellWell";
import ListWater from "../../../components/ListWater";
import Footer from "../../../components/Footer";
import ResLocation from "../../../components/ResLocation";
import { useEffect, useState } from "react";

function HomePage() {
  const [login, setLogin] = useState({});

  useEffect(() => {
    const isLogin = async () => {
      try {
        const message = await checkLogin();
        if (message.errCode === 0) {
          setLogin(message.user);
          localStorage.setItem("userLogin", JSON.stringify(message.user));
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
    <div
      className="w-full h-auto bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${snow})` }}
    >
      <Header login={login} setLogin={setLogin} isShowCart={true} />
      <Banner login={login} />
      {/* <DishPopular/> */}
      <SellWell login={login} setLogin={setLogin} />
      <ListWater login={login} setLogin={setLogin} />
      <IntroduceChef />
      {/* <RestaurantSpace/> */}
      <ResLocation />
      <Footer />
    </div>
  );
}

export default HomePage;
