import {
  faAdd,
  faEdit,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import moment from "moment";
import { getAllStaff } from "../../../apis/staff.api";
import { POSITION_OPTIONS, STATUS_OPTIONS } from "../../../constants/staff";
import { Link } from "react-router";
import ChangeStatusModal from "./ChangeStatusModal";

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-200">
      <td className="p-5">
        <div className="h-[1.4rem] w-[3rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="w-[4.8rem] h-[4.8rem] rounded-full bg-gray-200 mx-auto" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[12rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[14rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[2.2rem] w-[10rem] rounded-full bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[2.2rem] w-[10rem] rounded-full bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[9rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[8rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="flex gap-[.8rem] justify-center">
          <div className="h-[3rem] w-[7rem] rounded-[.5rem] bg-gray-200" />
          <div className="h-[3rem] w-[7rem] rounded-[.5rem] bg-gray-200" />
        </div>
      </td>
    </tr>
  );
}

function Stats({ stats }) {
  return (
    <div className="grid grid-cols-4 gap-[1.2rem]">
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem]">Tổng nhân viên</p>
        <p className="text-[2.5rem] font-semibold text-gray-800">
          {stats.total}
        </p>
      </div>
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem]">Đang làm việc</p>
        <p className="text-[2.5rem] font-semibold text-green-700">
          {stats.working}
        </p>
        <p className="text-[1.2rem] text-gray-500 mt-[.4rem]">
          {stats.total ? Math.round((stats.working / stats.total) * 100) : 0}%
          tổng nhân viên
        </p>
      </div>
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-500 mb-[.6rem]">Nghỉ phép</p>
        <p className="text-[2.5rem] font-semibold text-amber-700">
          {stats.onLeave}
        </p>
        <p className="text-[1.2rem] text-gray-500 mt-[.4rem]">
          {stats.total ? Math.round((stats.onLeave / stats.total) * 100) : 0}%
          tổng nhân viên
        </p>
      </div>
      <div className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]">
        <p className="text-[1.6rem] text-gray-400 mb-[.6rem]">Đã nghỉ việc</p>
        <p className="text-[2.5rem] font-semibold text-red-700">
          {stats.resigned}
        </p>
        <p className="text-[1.2rem] text-gray-400 mt-[.4rem]">
          {stats.total ? Math.round((stats.resigned / stats.total) * 100) : 0}%
          tổng nhân viên
        </p>
      </div>
    </div>
  );
}

function Staff() {
  const [showAddStaff, setShowAddStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [staffs, setStaffs] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);

  const handleGetAllStaff = async () => {
    setIsLoading(true);
    try {
      const res = await getAllStaff();
      if (res.status === 200) setStaffs(res?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllStaff();
  }, []);

  const stats = {
    total: staffs.length,
    working: staffs.filter((s) => s.status === "WORKING").length,
    onLeave: staffs.filter((s) => s.status === "ON_LEAVE").length,
    resigned: staffs.filter((s) => s.status === "RESIGNED").length,
  };

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Quản lý nhân viên
          </h3>
          <p className="text-gray-500">
            Quản lý toàn bộ nhân viên của nhà hàng.
          </p>
        </div>
        <Link
          to={"action"}
          className="flex items-center justify-center space-x-2 px-8 py-4 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors text-white text-[1.6rem]"
        >
          <FontAwesomeIcon icon={faAdd} />
          <span>Thêm nhân viên</span>
        </Link>
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
            placeholder="Tìm tên nhân viên..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full h-[4.2rem] pl-[3.6rem] pr-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
          />
        </div>
        <select
          name="position"
          id="position"
          className="w-full h-[4.2rem] pl-[1rem] pr-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
        >
          <option value="">Chức vụ</option>
          {POSITION_OPTIONS.map((position) => {
            return (
              <option key={position.value} value={position.value}>
                {position.label}
              </option>
            );
          })}
        </select>
        <select
          name="status"
          id="status"
          className="w-full h-[4.2rem] pl-[1rem] pr-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
        >
          <option value="">Trạng thái</option>
          {STATUS_OPTIONS.map((status) => {
            return (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            );
          })}
        </select>
      </div>

      <div className="w-full overflow-x-auto rounded-[.8rem] border border-gray-200">
        <table className="w-full text-[1.6rem] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left border-b border-gray-200">
              <th className="p-5 font-medium border-r border-gray-200 w-[6rem]">
                Mã
              </th>
              <th className="p-5 font-medium border-r border-gray-200 text-center w-[8rem]">
                Ảnh
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Họ tên
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Email
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Chức vụ
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Trạng thái
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Ngày bắt đầu
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Lương
              </th>
              <th className="p-5 font-medium text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            ) : staffs.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="text-center py-[4rem] text-gray-400 text-[1.6rem]">
                    Không có nhân viên nào
                  </div>
                </td>
              </tr>
            ) : (
              staffs.map((staff) => {
                return (
                  <tr
                    key={staff.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <td className="p-5 text-gray-500 border-r border-gray-200">
                      {staff.id}
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      <img
                        src={staff.image}
                        alt={staff.fullName}
                        className="w-[4.8rem] h-[4.8rem] rounded-full object-cover mx-auto border-2 border-gray-100"
                      />
                    </td>
                    <td className="p-5 font-medium text-gray-800 border-r border-gray-200">
                      <span className="line-clamp-1">{staff.fullName}</span>
                    </td>
                    <td className="p-5 text-gray-500 border-r border-gray-200">
                      <span className="line-clamp-1">{staff.email}</span>
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      <span className="inline-flex items-center px-[1rem] py-[.3rem] rounded-full text-[1.4rem] font-medium whitespace-nowrap">
                        {
                          POSITION_OPTIONS.find(
                            (it) => it.value === staff.position,
                          ).label
                        }
                      </span>
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      <span
                        className={`inline-flex items-center px-[1rem] py-[.3rem] rounded-full text-[1.4rem] font-medium whitespace-nowrap `}
                      >
                        {
                          STATUS_OPTIONS.find((it) => it.value === staff.status)
                            .label
                        }
                      </span>
                    </td>
                    <td className="p-5 text-gray-500 border-r border-gray-200 whitespace-nowrap">
                      {staff.startDate
                        ? moment(staff.startDate).format("DD/MM/YYYY")
                        : "—"}
                    </td>
                    <td className="p-5 text-gray-700 font-medium border-r border-gray-200 whitespace-nowrap">
                      {Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(staff.salary)}
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-[.8rem]">
                        <Link
                          to={`action/${staff.id}`}
                          className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-blue-50 text-blue-600 text-[1.6rem] rounded-[.6rem] cursor-pointer hover:bg-blue-100 transition-colors whitespace-nowrap"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Sửa
                        </Link>
                        <button
                          onClick={() => setSelectedStaff(staff)}
                          className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-amber-50 text-amber-600 text-[1.6rem] rounded-[.6rem] cursor-pointer hover:bg-amber-100 transition-colors whitespace-nowrap"
                        >
                          Trạng thái
                        </button>
                        <button
                          onClick={() => setSelectedStaff(staff)}
                          className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-red-50 text-red-600 text-[1.6rem] rounded-[.6rem] cursor-pointer hover:bg-red-100 transition-colors whitespace-nowrap"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                          Xóa
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

      {showAddStaff && (
        <AddStaff
          showAddStaff={showAddStaff}
          handleShowAddStaff={setShowAddStaff}
          handleGetAllStaff={handleGetAllStaff}
        />
      )}

      {selectedStaff && (
        <ChangeStatusModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onSuccess={handleGetAllStaff}
        />
      )}
    </div>
  );
}

export default Staff;
