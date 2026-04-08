import { useQuery } from "@tanstack/react-query";
import { getAllCustomer } from "../../../apis/customer.api";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function StatsCustomer({ stats }) {
  return (
    <div className="grid grid-cols-4 gap-[1.2rem]">
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem]">
          Tổng khách hàng
        </p>
        <p className="text-[2.5rem]  text-blue-600 font-semibold">
          {stats.total}
        </p>
      </div>
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem] ">Doanh thu</p>
        <p className="text-[2.5rem]  text-green-700 font-semibold">
          {stats.working}
        </p>
        <p className="text-[1.2rem] text-gray-500 mt-[.4rem]">tổng tiền</p>
      </div>
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem] ">Đã trả</p>
        <p className="text-[2.5rem]  text-amber-700 font-semibold">
          {stats.onLeave}
        </p>
        <p className="text-[1.2rem] text-gray-500 mt-[.4rem]">tổng tiền</p>
      </div>
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-400 mb-[.6rem] ">Đang thu</p>
        <p className="text-[2.5rem]  text-red-700 font-semibold">
          {stats.resigned}
        </p>
        <p className="text-[1.2rem] text-gray-400 mt-[.4rem]">tổng tiền</p>
      </div>
    </div>
  );
}

function CustomerPage() {
  const [queryDefault, setQueryDefault] = useState({
    limit: 10,
    page: 1,
    phone: null,
  });
  const [searchPhone, setSearchPhone] = useState("");
  const { data: resCustomer, isLoading } = useQuery({
    queryKey: ["customers", queryDefault],
    queryFn: () => getAllCustomer(queryDefault),
  });

  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const stats = {
    total: resCustomer?.data?.length || 1500,
    working: formatPrice(500000000),
    onLeave: formatPrice(300000000),
    resigned: formatPrice(0),
  };

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Quản lý khách hàng
          </h3>
          <p className="text-gray-500">
            Quản lý toàn bộ khách hàng của nhà hàng.
          </p>
        </div>
      </div>

      <StatsCustomer stats={stats} />

      <div className="grid grid-cols-4 gap-5">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 text-gray-400 text-[1.4rem]"
          />
          <input
            type="text"
            name="customerName"
            placeholder="Tìm tên khách hàng..."
            value={searchPhone || ""}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="w-full h-[4.2rem] pl-[3.6rem] pr-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
          />
        </div>
        <div className="col-span-1">
          <button
            className="px-6 h-[4.2rem] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => {
              if (
                searchPhone.trim().length >= 10 ||
                searchPhone.trim().length <= 10
              ) {
                setQueryDefault((prev) => ({ ...prev, phone: searchPhone }));
              }
            }}
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>Lọc</span>
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-[.8rem] border border-gray-200">
        <table className="w-full text-[1.6rem] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left border-b border-gray-200">
              <th className="p-5 font-medium border-r border-gray-200">
                Khách hàng
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Số điện thoại
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Email
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Số đơn
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Trạng thái
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0">
              <td className="p-5 text-gray-500 border-r border-gray-200">
                Nguyễn Trung Kiên
              </td>
              <td className="p-5 border-r border-gray-200">0357124583</td>
              <td className="p-5 border-r border-gray-200">
                trungkiendz@gmail.com
              </td>
              <td className="p-5 border-r border-gray-200">6</td>
              <td className="p-5 border-r border-gray-200">
                Hoạt động / Bị khóa
              </td>
              <td className="p-5 border-r border-gray-200">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white">
                    Chi tiết
                  </button>
                  <button className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white">
                    Khóa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerPage;
