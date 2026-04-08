import {
  faAdd,
  faEdit,
  faFilter,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Stats from "../../../../components/Stats";
import ActionSupplier from "./ActionSupplier";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { getAllSuppliers } from "../../../../apis/supplier.api";
import { useQuery } from "@tanstack/react-query";
import ToggleStatus from "./ToggleStatus";

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0">
      <td className="p-5 text-gray-500 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </td>
      <td className="p-5 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </td>
      <td className="p-5 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </td>
      <td className="p-5 border-r border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </td>
      <td className="p-5 border-r border-gray-200 text-center">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </td>
    </tr>
  );
}

function Supplier() {
  const [showAction, setShowAction] = useState({
    open: false,
    action: "",
    dataUpdate: null,
  });
  const [openToggleStatus, setOpenToggleStatus] = useState(null);
  const {
    data: dataSuppliers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getAllSuppliers,
  });
  const suppliers = dataSuppliers?.data || [];

  const stats = [
    {
      title: "Tổng nhà cung cấp",
      value: suppliers.length,
      color: "text-blue-500",
    },
    {
      title: "Đang hoạt động",
      value: suppliers.filter((s) => s.status === "active").length,
      color: "text-green-500",
    },
    {
      title: "Ngừng hoạt động",
      value: suppliers.filter((s) => s.status === "inactive").length,
      color: "text-red-500",
    },
  ];

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[2.2rem] font-semibold text-gray-800 mb-2">
            Quản lý nhà cung cấp
          </h2>
          <p className="text-gray-600 text-[1.4rem]">
            Quản lý toàn bộ nhà cung cấp của nhà hàng
          </p>
        </div>
        <button
          className="flex items-center justify-center space-x-2 px-8 py-4 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors text-white text-[1.6rem]"
          onClick={() =>
            setShowAction({
              open: true,
              action: "create",
              dataUpdate: null,
            })
          }
        >
          <FontAwesomeIcon icon={faAdd} />
          <span>Thêm nhà cung cấp</span>
        </button>
      </div>

      <Stats stats={stats} />

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
            // value={searchPhone || ""}
            // onChange={(e) => setSearchPhone(e.target.value)}
            className="w-full h-[4.2rem] pl-[3.6rem] pr-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
          />
        </div>
        <div className="col-span-1">
          <button
            className="px-6 h-[4.2rem] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            // onClick={() => {
            //   if (
            //     searchPhone.trim().length >= 10 ||
            //     searchPhone.trim().length <= 10
            //   ) {
            //     setQueryDefault((prev) => ({ ...prev, phone: searchPhone }));
            //   }
            // }}
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
                Nhà cung cấp
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Số điện thoại
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Email
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Trạng thái
              </th>
              <th className="p-5 font-medium border-r border-gray-200 text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-5 text-center text-gray-500">
                  Không có sản phẩm nào trong kho.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => {
                return (
                  <tr
                    key={supplier.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <td className="p-5 text-gray-500 border-r border-gray-200">
                      {supplier.name}
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      {supplier.phone}
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      {supplier.email}
                    </td>
                    <td className={`p-5 border-r border-gray-200 `}>
                      <span
                        className={`${supplier.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} block px-5 py-2 text-center rounded-full`}
                      >
                        {supplier.status === "active"
                          ? "Hoạt động"
                          : "Ngừng hoạt động"}
                      </span>
                    </td>
                    <td className="p-5 border-r border-gray-200 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          className="px-4 py-2 text-[1.4rem] space-x-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white"
                          onClick={() =>
                            setShowAction({
                              open: true,
                              action: "edit",
                              dataUpdate: supplier,
                            })
                          }
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          <span>Sửa</span>
                        </button>
                        <button
                          className={`px-4 py-2 text-[1.4rem] space-x-2 rounded-md ${supplier.status === "active" ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : "bg-green-500 hover:bg-green-600 text-white"} `}
                          onClick={() => setOpenToggleStatus(supplier)}
                        >
                          {supplier.status === "active" ? "Ngừng" : "Mở"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showAction.open && (
          <ActionSupplier
            action={showAction.action}
            dataUpdate={showAction.dataUpdate}
            onClose={() =>
              setShowAction({ open: false, action: "", dataUpdate: null })
            }
            refetch={refetch}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openToggleStatus && (
          <ToggleStatus
            supplier={openToggleStatus}
            onClose={() => setOpenToggleStatus(null)}
            refetch={refetch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Supplier;
