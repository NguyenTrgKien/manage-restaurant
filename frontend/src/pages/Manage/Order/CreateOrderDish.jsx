import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTrash,
  faMinus,
  faPlus,
  faSearch,
  faShoppingCart,
  faUser,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { createOrder } from "../../../apis/order.api";
import { useAuth } from "../../../hooks/useAuth";

const PAYMENT_METHODS = [
  { value: "MOMO", label: "Ví MoMo" },
  { value: "CASH", label: "Tiền mặt" },
];

function FoodCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[.8rem] border border-gray-200 overflow-hidden">
      <div className="h-[12rem] bg-gray-200" />
      <div className="p-[1rem] space-y-2">
        <div className="h-[1.4rem] w-3/4 bg-gray-200 rounded" />
        <div className="h-[1.2rem] w-1/2 bg-gray-200 rounded" />
        <div className="h-[3.2rem] w-full bg-gray-200 rounded-[.6rem] mt-2" />
      </div>
    </div>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex items-center gap-[1rem] py-[1rem] border-b border-gray-100 last:border-b-0">
      <img
        src={item.image || "/placeholder-food.png"}
        alt={item.name}
        className="w-[5rem] h-[5rem] rounded-[.6rem] object-cover flex-shrink-0 bg-gray-100"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[1.6rem] font-medium text-gray-800 line-clamp-1">
          {item.name}
        </p>
        <p className="text-[1.6rem] text-red-500 font-medium">
          {Number(item.price).toLocaleString("vi-VN")}đ
        </p>
      </div>
      <div className="flex items-center gap-[.6rem]">
        <button
          onClick={() => onDecrease(item.id)}
          className="w-[2.6rem] h-[2.6rem] rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-[1.6rem]"
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <span className="text-[1.6rem] font-medium w-[2rem] text-center">
          {item.qty}
        </span>
        <button
          onClick={() => onIncrease(item.id)}
          className="w-[2.6rem] h-[2.6rem] rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-[1.6rem]"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="w-[2.6rem] h-[2.6rem] rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors text-[1.6rem] ml-[.4rem] cursor-pointer"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

function CreateOrderDish() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchFood, setSearchFood] = useState("");
  const [cart, setCart] = useState([]);
  const [fullName, setFullName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [errors, setErrors] = useState({});

  const { data: foodRes, isLoading: isFoodLoading } = useQuery({
    queryKey: ["foods"],
    queryFn: () => getAllFood(),
  });

  const foods = foodRes?.data?.data ?? [];

  const filteredFoods = foods.filter((f) =>
    (f.name ?? "").toLowerCase().includes(searchFood.toLowerCase()),
  );

  const addToCart = (food) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === food.id);
      if (existing) {
        return prev.map((i) =>
          i.id === food.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...food, qty: 1 }];
    });
  };

  const increase = (id) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
    );

  const decrease = (id) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    );

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const mutation = useMutation({
    mutationFn: (payload) => createOrder(payload),
    onSuccess: (res) => {
      if (res?.data.errCode === 0) {
        if (res.data?.data.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        } else {
          navigate(-1);
        }
      } else {
        setErrors({ server: res?.message || "Tạo đơn thất bại" });
      }
    },
  });

  const handleSubmit = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập tên khách hàng!";
    if (cart.length === 0) newErrors.cart = "Vui lòng chọn ít nhất một món!";
    if (!paymentMethod)
      newErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const payload = {
      userId: user?.id ?? undefined,
      fullName: fullName.trim(),
      paymentMethod,
      items: cart.map((item) => ({
        foodId: item.id,
        quantity: item.qty,
      })),
    };

    mutation.mutate(payload);
  };

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md">
      <div className="flex items-center gap-[1.5rem] mb-[2.5rem]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-[3.8rem] h-[3.8rem] rounded-[.8rem] border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Tạo đơn đặt món
          </h3>
          <p className="text-gray-500">
            Chọn món và điền thông tin để tạo đơn hàng mới.
          </p>
        </div>
      </div>

      <div className="flex gap-[2rem] items-start">
        <div className="flex-1 min-w-0 space-y-[1.5rem]">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-[1.4rem] top-1/2 -translate-y-1/2 text-gray-400 text-[1.6rem]"
            />
            <input
              type="text"
              placeholder="Tìm tên món..."
              value={searchFood}
              onChange={(e) => setSearchFood(e.target.value)}
              className="w-full h-[4.2rem] pl-[4rem] pr-[1.4rem] border border-gray-300 rounded-[.8rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
            />
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-[1.2rem] max-h-[calc(100vh-22rem)] overflow-y-auto pr-[.4rem]">
            {isFoodLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <FoodCardSkeleton key={i} />
              ))
            ) : filteredFoods.length === 0 ? (
              <div className="col-span-3 py-[4rem] text-center text-gray-400 text-[1.6rem]">
                Không tìm thấy món nào
              </div>
            ) : (
              filteredFoods.map((food) => {
                const inCart = cart.find((i) => i.id === food.id);
                const isOutOfStock = food.quantity === 0;
                return (
                  <div
                    key={food.id}
                    className={`rounded-[.8rem] border overflow-hidden transition-all ${
                      inCart
                        ? "border-cyan-400 shadow-[0_0_0_2px_rgba(6,182,212,.15)]"
                        : "border-gray-200 hover:border-gray-300"
                    } ${isOutOfStock ? "opacity-50" : ""}`}
                  >
                    <div className="relative">
                      <img
                        src={food.image || "/placeholder-food.png"}
                        alt={food.name}
                        className="w-full h-[15rem] object-cover bg-gray-100"
                      />
                      {inCart && (
                        <span className="absolute top-[.8rem] right-[.8rem] bg-cyan-500 text-white text-[1.1rem] font-medium px-[.8rem] py-[.2rem] rounded-full">
                          x{inCart.qty}
                        </span>
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="text-[1.6rem] text-gray-500 font-medium">
                            Hết hàng
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-[1rem]">
                      <p className="text-[1.6rem] font-medium text-gray-800 line-clamp-1 mb-[.2rem]">
                        {food.name}
                      </p>
                      <p className="text-[1.6rem] text-red-500 font-medium mb-[1rem]">
                        {Number(food.price).toLocaleString("vi-VN")}đ
                      </p>
                      <button
                        disabled={isOutOfStock}
                        onClick={() => addToCart(food)}
                        className="w-full h-[3.4rem] rounded-[.6rem] bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[1.6rem] font-medium transition-colors"
                      >
                        {inCart ? "Thêm nữa" : "Thêm vào đơn"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {errors.cart && (
            <p className="text-red-500 text-[1.6rem]">{errors.cart}</p>
          )}
        </div>

        <div className="w-[45rem] flex-shrink-0 space-y-[1.5rem]">
          <div className="rounded-[.8rem] border border-gray-200 p-[1.5rem] space-y-[1.2rem]">
            <h4 className="text-[1.6rem] font-semibold text-gray-700 flex items-center gap-[.8rem]">
              <FontAwesomeIcon
                icon={faUser}
                className="text-cyan-500 text-[1.6rem]"
              />
              Thông tin khách hàng
            </h4>

            <div>
              <label className="block text-[1.6rem] text-gray-600 mb-[.5rem]">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên khách hàng..."
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName)
                    setErrors((p) => ({ ...p, fullName: "" }));
                }}
                className={`w-full h-[4.2rem] px-[1.2rem] border rounded-[.6rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem] ${
                  errors.fullName ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-[1.6rem] mt-[.4rem]">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[1.6rem] text-gray-600 mb-[.5rem]">
                Phương thức thanh toán <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-[.8rem]">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.value}
                    onClick={() => setPaymentMethod(pm.value)}
                    className={`h-[3.8rem] rounded-[.6rem] text-[1.6rem] font-medium border transition-all ${
                      paymentMethod === pm.value
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-[1.6rem] mt-[.4rem]">
                  {errors.paymentMethod}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[.8rem] border border-gray-200 p-[1.5rem]">
            <h4 className="text-[1.6rem] font-semibold text-gray-700 flex items-center gap-[.8rem] mb-[1rem]">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-cyan-500 text-[1.6rem]"
              />
              Đơn hàng
              {cart.length > 0 && (
                <span className="ml-auto text-[1.6rem] font-normal text-gray-400">
                  {cart.length} loại món
                </span>
              )}
            </h4>

            {cart.length === 0 ? (
              <div className="py-[3rem] text-center text-gray-400 text-[1.6rem]">
                Chưa có món nào được chọn
              </div>
            ) : (
              <div className="max-h-[28rem] overflow-y-auto">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncrease={increase}
                    onDecrease={decrease}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            )}

            <div className="mt-[1.2rem] pt-[1.2rem] border-t border-gray-100 flex items-center justify-between">
              <span className="text-[1.6rem] text-gray-700">Tổng cộng</span>
              <span className="text-[1.8rem] text-red-500">
                {Number(totalAmount).toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          <div className="flex gap-[1rem]">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 h-[4.4rem] rounded-[.8rem] border border-gray-300 text-gray-600 text-[1.6rem] font-medium hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="flex-1 h-[4.4rem] rounded-[.8rem] bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white text-[1.6rem] font-medium transition-colors flex items-center justify-center gap-[.8rem]"
            >
              <FontAwesomeIcon icon={faCreditCard} />
              {mutation.isPending ? "Đang tạo..." : "Tạo đơn hàng"}
            </button>
          </div>

          {mutation.isError && (
            <p className="text-red-500 text-[1.6rem] text-center">
              Tạo đơn thất bại, vui lòng thử lại!
            </p>
          )}

          {errors.server && (
            <p className="text-red-500 text-[1.6rem] text-center">
              {errors.server}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateOrderDish;
