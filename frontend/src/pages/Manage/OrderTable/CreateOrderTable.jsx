import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUser,
  faCalendarDays,
  faClock,
  faChair,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faUsers,
  faUtensils,
  faSearch,
  faPlus,
  faMinus,
  faTrash,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../hooks/useAuth";
import { getAllTable } from "../../../apis/table.api";
import { getAllTimeframe } from "../../../apis/timeframe.api";
import {
  checkOrderTableDist,
  createOrderTable,
  createOrder,
} from "../../../apis/order.api";
import { getAllFood } from "../../../apis/menu.api";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[.8rem] border border-gray-200 p-[1.2rem] space-y-2">
      <div className="h-[1.6rem] w-3/4 bg-gray-200 rounded" />
      <div className="h-[1.2rem] w-1/2 bg-gray-200 rounded" />
    </div>
  );
}

function FoodCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[.8rem] border border-gray-200 overflow-hidden">
      <div className="h-[10rem] bg-gray-200" />
      <div className="p-[1rem] space-y-2">
        <div className="h-[1.4rem] w-3/4 bg-gray-200 rounded" />
        <div className="h-[1.2rem] w-1/2 bg-gray-200 rounded" />
        <div className="h-[3rem] w-full bg-gray-200 rounded-[.6rem]" />
      </div>
    </div>
  );
}

function AvailableBadge({ status }) {
  if (!status) return null;
  if (status === "checking")
    return (
      <span className="flex items-center gap-[.4rem] text-[1.3rem] text-gray-400">
        <FontAwesomeIcon icon={faSpinner} spin />
        Đang kiểm tra
      </span>
    );
  if (status === "available")
    return (
      <span className="flex items-center gap-[.4rem] text-[1.3rem] text-green-600 font-medium">
        <FontAwesomeIcon icon={faCheckCircle} />
        Còn trống
      </span>
    );
  return (
    <span className="flex items-center gap-[.4rem] text-[1.3rem] text-red-500 font-medium">
      <FontAwesomeIcon icon={faTimesCircle} />
      Đã có người đặt
    </span>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex items-center gap-[1rem] py-[1rem] border-b border-gray-100 last:border-b-0">
      <img
        src={item.image || "/placeholder-food.png"}
        alt={item.name}
        className="w-[4.8rem] h-[4.8rem] rounded-[.6rem] object-cover flex-shrink-0 bg-gray-100"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[1.5rem] font-medium text-gray-800 line-clamp-1">
          {item.name}
        </p>
        <p className="text-[1.4rem] text-red-500 font-medium">
          {Number(item.price).toLocaleString("vi-VN")}đ
        </p>
      </div>
      <div className="flex items-center gap-[.5rem]">
        <button
          onClick={() => onDecrease(item.id)}
          className="w-[2.4rem] h-[2.4rem] rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <FontAwesomeIcon icon={faMinus} className="text-[1.2rem]" />
        </button>
        <span className="text-[1.5rem] font-medium w-[2rem] text-center">
          {item.qty}
        </span>
        <button
          onClick={() => onIncrease(item.id)}
          className="w-[2.4rem] h-[2.4rem] rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="text-[1.2rem]" />
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="w-[2.4rem] h-[2.4rem] rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors ml-[.2rem] cursor-pointer"
        >
          <FontAwesomeIcon icon={faTrash} className="text-[1.2rem]" />
        </button>
      </div>
    </div>
  );
}

function CreateOrderTable() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("table");

  const [fullName, setFullName] = useState("");
  const [numberGuests, setNumberGuests] = useState(1);
  const [orderDate, setOrderDate] = useState("");
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [selectedTimeFrameId, setSelectedTimeFrameId] = useState(null);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [availMap, setAvailMap] = useState({});

  const [cart, setCart] = useState([]);
  const [searchFood, setSearchFood] = useState("");

  const [createdOrderTableId, setCreatedOrderTableId] = useState(null);

  const { data: tableRes, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getAllTable,
  });
  const { data: tfRes, isLoading: tfLoading } = useQuery({
    queryKey: ["timeFrames"],
    queryFn: getAllTimeframe,
  });
  const { data: foodRes, isLoading: foodLoading } = useQuery({
    queryKey: ["foods"],
    queryFn: getAllFood,
    enabled: step === "food",
  });

  const tables = tableRes?.data?.data ?? [];
  const timeFrames = tfRes?.data ?? [];
  const foods = foodRes?.data?.data ?? [];
  const filteredFoods = foods.filter((f) =>
    (f.name ?? "").toLowerCase().includes(searchFood.toLowerCase()),
  );

  useEffect(() => {
    if (!orderDate || tables.length === 0 || timeFrames.length === 0) return;
    const pairs = [];
    tables.forEach((t) =>
      timeFrames.forEach((tf) =>
        pairs.push({ tableId: t.id, timeFrameId: tf.id }),
      ),
    );
    const checking = {};
    pairs.forEach(({ tableId, timeFrameId }) => {
      checking[`${tableId}-${timeFrameId}`] = "checking";
    });
    setAvailMap(checking);
    Promise.all(
      pairs.map(async ({ tableId, timeFrameId }) => {
        try {
          const res = await checkOrderTableDist({
            orderDate,
            tableId,
            timeFrameId,
          });
          return {
            key: `${tableId}-${timeFrameId}`,
            status: res.errCode === 0 ? "available" : "booked",
          };
        } catch {
          return { key: `${tableId}-${timeFrameId}`, status: "available" };
        }
      }),
    ).then((results) => {
      const map = {};
      results.forEach(({ key, status }) => (map[key] = status));
      setAvailMap(map);
    });
  }, [orderDate, tables.length, timeFrames.length]);

  useEffect(() => {
    setSelectedTableId(null);
    setSelectedTimeFrameId(null);
  }, [orderDate]);

  const selectedAvailKey =
    selectedTableId && selectedTimeFrameId
      ? `${selectedTableId}-${selectedTimeFrameId}`
      : null;
  const isSelectedBooked =
    selectedAvailKey && availMap[selectedAvailKey] === "booked";
  const selectedTableName =
    tables.find((t) => t.id === selectedTableId)?.name ?? "—";
  const selectedTimeFrame = timeFrames.find(
    (t) => t.id === selectedTimeFrameId,
  );
  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const addToCart = (food) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === food.id);
      if (existing)
        return prev.map((i) =>
          i.id === food.id ? { ...i, qty: i.qty + 1 } : i,
        );
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

  const tableMutation = useMutation({
    mutationFn: (payload) => createOrderTable(payload),
    onSuccess: (res) => {
      if (res?.errCode === 0) {
        setCreatedOrderTableId(res.data.id);
        setStep("food");
      } else {
        setErrors({ server: res?.message || "Đặt bàn thất bại!" });
      }
    },
  });

  const orderMutation = useMutation({
    mutationFn: (payload) => createOrder(payload),
    onSuccess: (res) => {
      if (res?.errCode === 0) navigate(-1);
      else setErrors({ server: res?.message || "Tạo đơn món thất bại!" });
    },
  });

  const handleSubmitTable = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập tên khách hàng!";
    if (!orderDate) newErrors.orderDate = "Vui lòng chọn ngày đến!";
    if (!selectedTableId) newErrors.table = "Vui lòng chọn bàn!";
    if (!selectedTimeFrameId) newErrors.timeFrame = "Vui lòng chọn khung giờ!";
    if (isSelectedBooked) newErrors.table = "Bàn này đã có người đặt!";
    if (numberGuests < 1)
      newErrors.numberGuests = "Số khách phải ít nhất là 1!";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    tableMutation.mutate({
      userId: user?.id ?? undefined,
      fullName: fullName.trim(),
      numberGuests: Number(numberGuests),
      orderDate,
      tableId: selectedTableId,
      timeFrameId: selectedTimeFrameId,
      note: note.trim() || undefined,
    });
  };

  const handleSubmitFood = () => {
    if (cart.length === 0) {
      navigate(-1);
      return;
    }
    orderMutation.mutate({
      userId: user?.id ?? undefined,
      fullName: fullName.trim(),
      orderTableId: createdOrderTableId,
      paymentMethod: "CASH",
      items: cart.map((item) => ({ foodId: item.id, quantity: item.qty })),
    });
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md">
      <div className="flex items-center gap-[1.5rem] mb-[2.5rem]">
        <button
          onClick={() => (step === "food" ? setStep("table") : navigate(-1))}
          className="flex items-center justify-center w-[3.8rem] h-[3.8rem] rounded-[.8rem] border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            {step === "table" ? "Tạo đơn đặt bàn" : "Thêm món cho bàn"}
          </h3>
          <p className="text-gray-500">
            {step === "table"
              ? "Chọn ngày, bàn, khung giờ và điền thông tin."
              : `Bàn ${selectedTableName} · ${selectedTimeFrame?.startTime ?? ""} – ${selectedTimeFrame?.endTime ?? ""}`}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-[1rem]">
          {[
            { key: "table", label: "Đặt bàn" },
            { key: "food", label: "Chọn món" },
          ].map((s, idx) => (
            <div key={s.key} className="flex items-center gap-[.8rem]">
              {idx > 0 && (
                <div className="w-[3rem] h-[.2rem] bg-gray-200 rounded-full" />
              )}
              <div className="flex items-center gap-[.6rem]">
                <div
                  className={`w-[2.8rem] h-[2.8rem] rounded-full flex items-center justify-center text-[1.3rem] font-semibold transition-all ${
                    step === s.key
                      ? "bg-cyan-500 text-white"
                      : step === "food" && s.key === "table"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step === "food" && s.key === "table" ? (
                    <FontAwesomeIcon icon={faCheckCircle} />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`text-[1.4rem] ${step === s.key ? "text-cyan-600 font-medium" : "text-gray-400"}`}
                >
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {step === "table" && (
        <div className="flex gap-[2rem] items-start">
          <div className="flex-1 min-w-0 space-y-[2rem]">
            <div className="rounded-[.8rem] border border-gray-200 p-[1.5rem] space-y-[1rem]">
              <h4 className="text-[1.6rem] font-semibold text-gray-700 flex items-center gap-[.8rem]">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className="text-cyan-500"
                />
                Chọn ngày đến
              </h4>
              <input
                type="date"
                min={todayStr}
                value={orderDate}
                onChange={(e) => {
                  setOrderDate(e.target.value);
                  if (errors.orderDate)
                    setErrors((p) => ({ ...p, orderDate: "" }));
                }}
                className={`w-full h-[4.2rem] px-[1.2rem] border rounded-[.6rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem] ${errors.orderDate ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.orderDate && (
                <p className="text-red-500 text-[1.6rem]">{errors.orderDate}</p>
              )}
            </div>

            <div className="rounded-[.8rem] border border-gray-200 p-[1.5rem] space-y-[1rem]">
              <h4 className="text-[1.6rem] font-semibold text-gray-700 flex items-center gap-[.8rem]">
                <FontAwesomeIcon icon={faClock} className="text-cyan-500" />
                Chọn khung giờ
              </h4>
              {tfLoading ? (
                <div className="grid grid-cols-3 gap-[1rem]">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-[1rem]">
                  {timeFrames.map((tf) => (
                    <button
                      key={tf.id}
                      onClick={() => {
                        setSelectedTimeFrameId(tf.id);
                        if (errors.timeFrame)
                          setErrors((p) => ({ ...p, timeFrame: "" }));
                      }}
                      className={`h-[4.4rem] rounded-[.8rem] border text-[1.6rem] font-medium transition-all ${
                        selectedTimeFrameId === tf.id
                          ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {tf.startTime} – {tf.endTime}
                    </button>
                  ))}
                </div>
              )}
              {errors.timeFrame && (
                <p className="text-red-500 text-[1.6rem]">{errors.timeFrame}</p>
              )}
            </div>

            <div className="rounded-[.8rem] border border-gray-200 p-[1.5rem] space-y-[1rem]">
              <h4 className="text-[1.6rem] font-semibold text-gray-700 flex items-center gap-[.8rem]">
                <FontAwesomeIcon icon={faChair} className="text-cyan-500" />
                Chọn bàn
                {!orderDate && (
                  <span className="ml-auto text-[1.3rem] font-normal text-gray-400">
                    Vui lòng chọn ngày trước
                  </span>
                )}
              </h4>
              {tablesLoading ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-[1.2rem]">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-[1.2rem] max-h-[calc(100vh-42rem)] overflow-y-auto pr-[.4rem]">
                  {tables.map((table) => {
                    const avKey = selectedTimeFrameId
                      ? `${table.id}-${selectedTimeFrameId}`
                      : null;
                    const avStatus = avKey ? availMap[avKey] : null;
                    const isBooked = avStatus === "booked";
                    return (
                      <div
                        key={table.id}
                        onClick={() => {
                          if (isBooked) return;
                          setSelectedTableId(table.id);
                          if (errors.table)
                            setErrors((p) => ({ ...p, table: "" }));
                        }}
                        className={`rounded-[.8rem] border p-[1.2rem] transition-all cursor-pointer select-none ${
                          isBooked
                            ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
                            : selectedTableId === table.id
                              ? "border-cyan-500 bg-cyan-50 shadow-[0_0_0_2px_rgba(6,182,212,.15)]"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <p className="text-[1.6rem] font-semibold text-gray-800">
                          {table.name}
                        </p>
                        <p className="text-[1.3rem] text-gray-500 mt-[.2rem]">
                          Sức chứa: {table.capacity} người
                        </p>
                        <div className="mt-[.6rem]">
                          <AvailableBadge status={avStatus} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {errors.table && (
                <p className="text-red-500 text-[1.6rem]">{errors.table}</p>
              )}
            </div>
          </div>

          <div className="w-[42rem] flex-shrink-0 space-y-[1.5rem]">
            <div className="rounded-[.8rem] border border-gray-200 p-[1.5rem] space-y-[1.2rem]">
              <h4 className="text-[1.6rem] font-semibold text-gray-700 flex items-center gap-[.8rem]">
                <FontAwesomeIcon icon={faUser} className="text-cyan-500" />
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
                  className={`w-full h-[4.2rem] px-[1.2rem] border rounded-[.6rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem] ${errors.fullName ? "border-red-400" : "border-gray-300"}`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-[1.6rem] mt-[.4rem]">
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[1.6rem] text-gray-600 mb-[.5rem]">
                  Số khách <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-[1rem]">
                  <button
                    onClick={() => setNumberGuests((n) => Math.max(1, n - 1))}
                    className="w-[3.6rem] h-[3.6rem] rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-[1.8rem]"
                  >
                    –
                  </button>
                  <span className="text-[2rem] font-semibold w-[3rem] text-center text-gray-800">
                    {numberGuests}
                  </span>
                  <button
                    onClick={() => setNumberGuests((n) => n + 1)}
                    className="w-[3.6rem] h-[3.6rem] rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-[1.8rem]"
                  >
                    +
                  </button>
                  <span className="text-[1.6rem] text-gray-400">người</span>
                </div>
              </div>
              <div>
                <label className="block text-[1.6rem] text-gray-600 mb-[.5rem]">
                  Ghi chú
                </label>
                <textarea
                  rows={3}
                  placeholder="Yêu cầu đặc biệt..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-[1.2rem] py-[1rem] border border-gray-300 rounded-[.6rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem] resize-none"
                />
              </div>
            </div>

            <div className="rounded-[.8rem] border border-gray-200 p-[1.5rem] space-y-[1rem]">
              <h4 className="text-[1.6rem] font-semibold text-gray-700 flex items-center gap-[.8rem]">
                <FontAwesomeIcon icon={faUsers} className="text-cyan-500" />
                Tóm tắt
              </h4>
              <div className="space-y-[.8rem] text-[1.5rem]">
                {[
                  [
                    "Ngày đến",
                    orderDate
                      ? new Date(orderDate).toLocaleDateString("vi-VN")
                      : "—",
                  ],
                  [
                    "Khung giờ",
                    selectedTimeFrame
                      ? `${selectedTimeFrame.startTime} – ${selectedTimeFrame.endTime}`
                      : "—",
                  ],
                  ["Bàn", selectedTableName],
                  ["Số khách", `${numberGuests} người`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
                {selectedAvailKey && (
                  <div className="flex justify-between items-center pt-[.4rem] border-t border-gray-100">
                    <span className="text-gray-500">Tình trạng</span>
                    <AvailableBadge status={availMap[selectedAvailKey]} />
                  </div>
                )}
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
                onClick={handleSubmitTable}
                disabled={tableMutation.isPending || isSelectedBooked}
                className="flex-1 h-[4.4rem] rounded-[.8rem] bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[1.6rem] font-medium transition-colors flex items-center justify-center gap-[.8rem]"
              >
                <FontAwesomeIcon icon={faChair} />
                {tableMutation.isPending ? "Đang đặt..." : "Đặt bàn →"}
              </button>
            </div>
            {errors.server && (
              <p className="text-red-500 text-[1.6rem] text-center">
                {errors.server}
              </p>
            )}
          </div>
        </div>
      )}

      {step === "food" && (
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
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-[1.2rem] max-h-[calc(100vh-22rem)] overflow-y-auto pr-[.4rem]">
              {foodLoading ? (
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
                      className={`rounded-[.8rem] border overflow-hidden transition-all ${inCart ? "border-cyan-400 shadow-[0_0_0_2px_rgba(6,182,212,.15)]" : "border-gray-200 hover:border-gray-300"} ${isOutOfStock ? "opacity-50" : ""}`}
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
                        <p className="text-[1.5rem] font-medium text-gray-800 line-clamp-1 mb-[.2rem]">
                          {food.name}
                        </p>
                        <p className="text-[1.5rem] text-red-500 font-medium mb-[.8rem]">
                          {Number(food.price).toLocaleString("vi-VN")}đ
                        </p>
                        <button
                          disabled={isOutOfStock}
                          onClick={() => addToCart(food)}
                          className="w-full h-[3.2rem] rounded-[.6rem] bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[1.4rem] font-medium transition-colors"
                        >
                          {inCart ? "Thêm nữa" : "Thêm vào đơn"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="w-[42rem] flex-shrink-0 space-y-[1.5rem]">
            <div className="rounded-[.8rem] bg-cyan-50 border border-cyan-200 p-[1.5rem]">
              <div className="flex items-center gap-[.8rem] mb-[.8rem]">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-cyan-500 text-[1.8rem]"
                />
                <span className="text-[1.6rem] font-semibold text-cyan-700">
                  Đặt bàn thành công!
                </span>
              </div>
              <div className="space-y-[.4rem] text-[1.4rem] text-cyan-700">
                <p>
                  Bàn: <strong>{selectedTableName}</strong>
                </p>
                <p>
                  Khung giờ:{" "}
                  <strong>
                    {selectedTimeFrame?.startTime} –{" "}
                    {selectedTimeFrame?.endTime}
                  </strong>
                </p>
                <p>
                  Khách: <strong>{fullName}</strong> · {numberGuests} người
                </p>
              </div>
            </div>

            <div className="rounded-[.8rem] border border-gray-200 p-[1.5rem]">
              <h4 className="text-[1.6rem] font-semibold text-gray-700 flex items-center gap-[.8rem] mb-[1rem]">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="text-cyan-500"
                />
                Đơn món
                {cart.length > 0 && (
                  <span className="ml-auto text-[1.4rem] font-normal text-gray-400">
                    {cart.length} loại
                  </span>
                )}
              </h4>
              {cart.length === 0 ? (
                <div className="py-[3rem] text-center text-gray-400 text-[1.5rem]">
                  <FontAwesomeIcon
                    icon={faUtensils}
                    className="text-[3rem] mb-[1rem] block mx-auto text-gray-200"
                  />
                  Chưa chọn món nào
                </div>
              ) : (
                <div className="max-h-[24rem] overflow-y-auto">
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
              {cart.length > 0 && (
                <div className="mt-[1.2rem] pt-[1.2rem] border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[1.6rem] text-gray-700">Tổng cộng</span>
                  <span className="text-[1.8rem] font-semibold text-red-500">
                    {Number(totalAmount).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-[1rem]">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 h-[4.4rem] rounded-[.8rem] border border-gray-300 text-gray-600 text-[1.6rem] font-medium hover:bg-gray-50 transition-colors"
              >
                Bỏ qua
              </button>
              <button
                onClick={handleSubmitFood}
                disabled={orderMutation.isPending}
                className="flex-1 h-[4.4rem] rounded-[.8rem] bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white text-[1.6rem] font-medium transition-colors flex items-center justify-center gap-[.8rem]"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                {orderMutation.isPending
                  ? "Đang lưu..."
                  : cart.length > 0
                    ? "Xác nhận đơn món"
                    : "Hoàn tất"}
              </button>
            </div>
            {errors.server && (
              <p className="text-red-500 text-[1.6rem] text-center">
                {errors.server}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateOrderTable;
