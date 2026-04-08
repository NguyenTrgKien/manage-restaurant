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
  faBowlFood,
  faFilter,
  faClose,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../hooks/useAuth";
import { getAllTable } from "../../../apis/table.api";
import { getAllTimeframe } from "../../../apis/timeframe.api";
import { checkOrderTableDist, createOrderTable } from "../../../apis/order.api";
import { getCustomerByPhone } from "../../../apis/customer.api";
import { getAllFood } from "../../../apis/menu.api";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[.8rem] border border-gray-200 p-[1.2rem] space-y-2">
      <div className="h-[1.6rem] w-3/4 bg-gray-200 rounded" />
      <div className="h-[1.2rem] w-1/2 bg-gray-200 rounded" />
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

function CreateOrderTable() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [isFetchingCustomer, setIsFetchingCustomer] = useState(false);
  const [numberGuests, setNumberGuests] = useState(1);
  const [orderDate, setOrderDate] = useState("");
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [selectedTimeFrameId, setSelectedTimeFrameId] = useState(null);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});

  const [dataQueryFood, setDataQueryFood] = useState({
    name: "",
    price: "asc",
  });
  const [queryFoodDefault, setQueryFoodDefault] = useState({
    limit: 10,
    page: 1,
    ...dataQueryFood,
  });
  const [openFood, setOpenFood] = useState(false);
  const [selectFoods, setSelectFoods] = useState([]);
  const [availMap, setAvailMap] = useState({});

  useEffect(() => {
    if (phoneNumber.trim().length !== 10) return;

    const timer = setTimeout(async () => {
      setIsFetchingCustomer(true);
      try {
        const res = await getCustomerByPhone(phoneNumber);
        if (res.status === 200) {
          setCustomer(res?.data?.data ?? null);
        }
      } catch {
        setCustomer(null);
      } finally {
        setIsFetchingCustomer(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [phoneNumber]);

  const { data: tableRes, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getAllTable,
  });
  const { data: tfRes, isLoading: tfLoading } = useQuery({
    queryKey: ["timeFrames"],
    queryFn: getAllTimeframe,
  });

  const tables = tableRes?.data?.data ?? [];
  const timeFrames = tfRes?.data ?? [];

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

  const { data: resFood, isLoading: isLoadingFood } = useQuery({
    queryKey: ["food", queryFoodDefault],
    queryFn: () => getAllFood(queryFoodDefault),
  });
  const food = resFood?.data?.data || [];

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

  const tableMutation = useMutation({
    mutationFn: (payload) => createOrderTable(payload),
    onSuccess: (res) => {
      console.log(res);

      if (res?.status === 200) {
        navigate(-1);
      } else {
        setErrors({ server: res?.message || "Đặt bàn thất bại!" });
      }
    },
  });

  const handleSubmitTable = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập tên khách hàng!";
    if (!phoneNumber.trim())
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại khách hàng!";
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
    const dataRequest = customer
      ? { customerId: customer.id }
      : { fullName: fullName.trim(), phoneNumber: phoneNumber.trim() };

    tableMutation.mutate({
      userId: user?.id ?? undefined,
      numberGuests: Number(numberGuests),
      orderDate,
      tableId: selectedTableId,
      timeFrameId: selectedTimeFrameId,
      note: note.trim() || undefined,
      ...(selectFoods.length > 0 ? { orderItems: selectFoods } : {}),
      ...dataRequest,
    });
  };

  const handleFilter = () => {
    setQueryFoodDefault((prev) => ({
      ...prev,
      ...dataQueryFood,
    }));
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md text-[1.4rem] md:text-[1.6rem]">
      <div className="flex items-center gap-5 mb-[2.5rem]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-[3.8rem] h-[3.8rem] rounded-[.8rem] border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Tạo đơn đặt bàn
          </h3>
          <p className="text-gray-500">
            Chọn ngày, bàn, khung giờ và điền thông tin.
          </p>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col gap-[2rem] items-start">
        <div className="flex-1 w-full md:min-w-0 space-y-[2rem]">
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
                {timeFrames.length > 0 ? (
                  timeFrames.map((tf) => (
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
                  ))
                ) : (
                  <div className="text-nowrap">Không có khung giờ</div>
                )}
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
                {tables.length > 0 ? (
                  tables.map((table) => {
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
                  })
                ) : (
                  <div>Không có bàn</div>
                )}
              </div>
            )}
            {errors.table && (
              <p className="text-red-500 text-[1.6rem]">{errors.table}</p>
            )}
          </div>
          <div className="rounded-[.8rem] border border-gray-200 p-[1.5rem] space-y-[1rem]">
            <h4 className="text-[1.6rem] font-semibold text-gray-700 flex items-center gap-[.8rem]">
              <FontAwesomeIcon icon={faBowlFood} className="text-cyan-500" />
              Chọn món ăn
              <button
                className="px-6 py-3 rounded-md bg-green-500 hover:bg-green-600 transition-colors duration-300 text-white ml-auto text-[1.3rem] font-normal"
                onClick={() => setOpenFood((prev) => !prev)}
              >
                {openFood ? "Đóng lại" : "Mở món ăn"}
              </button>
            </h4>
            <div className="my-5 border border-gray-300 p-5 rounded-md">
              <h4>Danh sách món ăn</h4>
              <div className="flex flex-col space-y-5">
                {selectFoods.length > 0 ? (
                  selectFoods.map((food) => (
                    <div
                      className="p-5 bg-green-50 border border-green-300 flex items-center justify-between rounded-md"
                      key={food.foodId}
                    >
                      <p>{food.foodName}</p>
                      <div className="flex items-center gap-5">
                        <p>{food.price}</p>
                        <button
                          className="w-10 h-10 rounded-md bg-red-100 flex items-center justify-center"
                          onClick={() => {
                            const newFood = selectFoods.filter(
                              (item) => item.foodId !== food.foodId,
                            );
                            setSelectFoods(newFood);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="text-[1.4rem] text-red-500"
                          />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center">Chưa chọn món</div>
                )}
              </div>
            </div>
            {openFood && (
              <div>
                <div className="grid grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="name"
                    value={dataQueryFood.name}
                    className="w-full h-[4.2rem] border border-gray-300 rounded-md focus:border-cyan-500 pl-5 outline-none"
                    placeholder="Tên món ăn..."
                    onChange={(e) =>
                      setDataQueryFood((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-5">
                    <select
                      name="price"
                      id="price"
                      value={dataQueryFood.price}
                      onChange={(e) =>
                        setDataQueryFood((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      className="h-[4.2rem] outline-none px-5 border border-gray-300 rounded-md flex items-center justify-center gap-2.5"
                    >
                      <option value="asc">Thấp đến cao</option>
                      <option value="desc">Cao đến thấp</option>
                    </select>
                    <button
                      className="h-[4.2rem] px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center gap-2.5"
                      onClick={handleFilter}
                    >
                      <FontAwesomeIcon icon={faFilter} />
                      <span>Lọc</span>
                    </button>
                  </div>
                </div>

                {isLoadingFood ? (
                  <div className="w-full text-center py-5">
                    Đang tải dữ liệu món ăn....
                  </div>
                ) : food.length > 0 ? (
                  food.map((it) => {
                    const isExist = selectFoods.find(
                      (item) => item.foodId === it.id,
                    );
                    return (
                      <div
                        key={it.id}
                        className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-10 md:gap-8 gap-5 mt-5 `}
                      >
                        <div
                          className={`w-full h-auto border border-gray-200 rounded-md ${isExist ? "border-2  border-green-500" : ""}`}
                        >
                          <img
                            src={it.image}
                            alt="image"
                            className="w-full h-[12rem] object-cover rounded-tl-md rounded-tr-md"
                          />
                          <div className="flex-1 p-2.5 space-y-2">
                            <p className="line-clamp-1">Thịt gà nướng</p>
                            <p className="text-[1.4rem] text-red-500">
                              {Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(150000)}
                            </p>
                            <button
                              className={`w-full h-[3.5rem] text-[1.4rem] ${isExist ? "bg-green-500 hover:bg-green-600" : "bg-blue-500  hover:bg-blue-600"} text-white  rounded-md  transition-colors duration-300 outline-none`}
                              onClick={() => {
                                setSelectFoods((prev) => {
                                  const dataAdd = {
                                    foodId: it.id,
                                    foodName: it.name,
                                    quantity: 1,
                                    price: it.price,
                                  };
                                  if (isExist) {
                                    return prev.filter(
                                      (item) => item.foodId !== it.id,
                                    );
                                  } else {
                                    return [...prev, dataAdd];
                                  }
                                });
                              }}
                            >
                              {isExist ? "Bỏ chọn" : "Chọn"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center py-5">
                    Không có món ăn nào....
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[42rem] flex-shrink-0 space-y-[1.5rem]">
          <div className="rounded-[.8rem] border border-gray-200 p-[1.5rem] space-y-[1.2rem]">
            <h4 className="text-[1.6rem] font-semibold text-gray-700 flex items-center gap-[.8rem]">
              <FontAwesomeIcon icon={faUser} className="text-cyan-500" />
              Thông tin khách hàng
            </h4>
            {customer ? (
              <div className="w-full h-[4.2rem] border rounded-[.6rem] outline-none bg-cyan-50 border-cyan-500 transition-all text-[1.6rem] flex items-center justify-center gap-5">
                <span>
                  {customer.fullName} - {customer.phoneNumber}
                </span>
                <div
                  className="h-[2.5rem] rounded-xl hover:bg-amber-600 px-4 text-[1.2rem] flex items-center justify-center bg-amber-500 text-white transition-colors duration-300 cursor-pointer"
                  onClick={() => {
                    setCustomer(null);
                    setPhoneNumber("");
                    setFullName("");
                  }}
                >
                  Thay đổi
                </div>
              </div>
            ) : (
              <>
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
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nhập số điện thoại..."
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (errors.phoneNumber)
                          setErrors((p) => ({ ...p, phoneNumber: "" }));
                      }}
                      className={`w-full h-[4.2rem] px-[1.2rem] border rounded-[.6rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem] ${errors.phoneNumber ? "border-red-400" : "border-gray-300"}`}
                    />
                    {isFetchingCustomer && (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        className="absolute right-[1.2rem] top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    )}
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-[1.6rem] mt-[.4rem]">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </>
            )}

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
                <span className="text-[2rem] w-[3rem] text-center text-gray-800">
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
    </div>
  );
}

export default CreateOrderTable;
