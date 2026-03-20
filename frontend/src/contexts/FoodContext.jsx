import { createContext, useEffect, useState } from "react";

export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [dataAllFood, setDataAllFood] = useState([]);
  const [currentCategoryId, setCurrentCategoryId] = useState(0);
  const [cart, setCart] = useState([]);
  const [login, setLogin] = useState({});

  useEffect(() => {
    const isLogin = async () => {
      try {
        const message = null;

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

  const handleGetAllFood = async () => {
    try {
      const data = null;
      if (data.errCode === 0) {
        setDataAllFood(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetAllFood();
  }, []);

  const getCartUser = async () => {
    if (!login && !login.id) {
      return;
    }
    try {
      // const response = await getCart(login.id);
      const response = { errCode: 1 };
      if (response.errCode === 0) {
        localStorage.setItem("food", JSON.stringify(response.cartItem));
        setCart(response.cartItem);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCartUser();
  }, [login]);

  return (
    <FoodContext.Provider
      value={{
        dataAllFood,
        handleGetAllFood,
        currentCategoryId,
        setCurrentCategoryId,
        cart,
        getCartUser,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};
