import { useState, useEffect } from "react";
import { POSITION_OPTIONS } from "../../../constants/staff";
import dayjs from "dayjs";
import {
  checkOutAttendance,
  getAttendanceByDate,
  markAttendance,
} from "../../../apis/attendance.api";
import ReasonModal from "./ReasonModal";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const STATUS_COLOR_MAP = {
  PRESENT: "bg-green-100 text-green-700",
  LATE: "bg-amber-100 text-amber-700",
  ABSENT: "bg-red-100 text-red-700",
  LEAVE: "bg-gray-100 text-gray-600",
};

const STATUS_LABEL_MAP = {
  PRESENT: "Đúng giờ",
  LATE: "Đi trễ",
  ABSENT: "Vắng mặt",
  LEAVE: "Nghỉ phép",
};

const NAV_BTNS = [
  { id: "ALL", name: "Tất cả" },
  { id: "PRESENT", name: "Có mặt" },
  { id: "LATE", name: "Đi trễ" },
  { id: "ABSENT", name: "Vắng mặt" },
  { id: "LEAVE", name: "Nghỉ phép" },
];

export const DAYS = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-200">
      <td className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-[4rem] h-[4rem] rounded-full bg-gray-200" />
          <div className="h-[1.4rem] w-[12rem] rounded bg-gray-200" />
        </div>
      </td>
      <td className="p-5">
        <div className="h-[2rem] w-[9rem] rounded-full bg-gray-200 mx-auto" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[5rem] rounded bg-gray-200 mx-auto" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[5rem] rounded bg-gray-200 mx-auto" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[4rem] rounded bg-gray-200 mx-auto" />
      </td>
      <td className="p-5">
        <div className="h-[2rem] w-[8rem] rounded-full bg-gray-200 mx-auto" />
      </td>
      <td className="p-5">
        <div className="h-[3rem] w-[5rem] rounded-[.6rem] bg-gray-200 mx-auto" />
      </td>
    </tr>
  );
}

function Stats({ data, isLoading }) {
  const total = data.length;
  const present = data.filter((s) => s.attendance?.status === "PRESENT").length;
  const late = data.filter((s) => s.attendance?.status === "LATE").length;
  const absent = data.filter(
    (s) => !s.attendance || s.attendance?.status === "ABSENT",
  ).length;

  const cards = [
    { label: "Tổng hôm nay", value: total, color: "text-gray-800" },
    { label: "Có mặt", value: present, color: "text-green-700" },
    { label: "Đi trễ", value: late, color: "text-amber-700" },
    { label: "Vắng mặt", value: absent, color: "text-red-700" },
  ];

  return (
    <div className="grid grid-cols-4 gap-[1.2rem]">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]"
        >
          <p className="text-[1.5rem] text-gray-500 mb-[.6rem]">{card.label}</p>
          {isLoading ? (
            <div className="h-[3rem] w-[5rem] rounded bg-gray-200 animate-pulse" />
          ) : (
            <p className={`text-[2.5rem] font-semibold ${card.color}`}>
              {card.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Attendance() {
  const [currentNav, setCurrentNav] = useState("ALL");
  const [positionFilter, setPositionFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectDate, setSelectDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [openReason, setOpenReason] = useState({
    open: false,
    staff: null,
    status: null,
  });

  const now = new Date();
  const today = DAYS[now.getDay()];

  const {
    data: responseAttendance,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["attendances", selectDate],
    queryFn: () => getAttendanceByDate(selectDate),
  });

  const staffList = responseAttendance?.data?.data ?? [];

  const handleChangeStatus = async (staffId, status) => {
    try {
      const res = await markAttendance({ staffId, status });
      if (res.status === 200) {
        await refetch();
        toast.success("Đã lưu chấm công!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCheckOut = async (attendanceId) => {
    try {
      const res = await checkOutAttendance(attendanceId);
      if (res.status === 200) {
        await refetch();
        toast.success("Đã lưu chấm công!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filtered = staffList.filter((staff) => {
    const status = staff.attendance?.status || "ABSENT";

    const matchNav = currentNav === "ALL" || status === currentNav;
    const matchPosition =
      positionFilter === "all" || staff.position === positionFilter;
    const matchSearch =
      !searchFilter ||
      staff.fullName.toLowerCase().includes(searchFilter.toLowerCase());

    return matchNav && matchPosition && matchSearch;
  });

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Chấm công nhân viên
          </h3>
          <p className="text-gray-500">
            {today}, {dayjs(now).format("DD/MM/YYYY")}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <input
            type="date"
            name="date"
            value={selectDate}
            max={dayjs().format("YYYY-MM-DD")}
            onChange={(e) => setSelectDate(e.target.value)}
            className="h-[4.2rem] w-[20rem] border border-gray-300 rounded-md px-5 focus:outline-none focus:border-cyan-500 text-[1.5rem]"
          />
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="h-[4.2rem] w-[20rem] border border-gray-300 rounded-md pl-5 focus:outline-none focus:border-cyan-500 text-[1.5rem]"
          >
            <option value="all">Tất cả các chức vụ</option>
            {POSITION_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Stats data={staffList} isLoading={isLoading} />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {NAV_BTNS.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setCurrentNav(btn.id)}
              className={`px-6 py-3 rounded-full text-[1.5rem] cursor-pointer transition-colors ${
                currentNav === btn.id
                  ? "bg-blue-400 text-white border border-transparent"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {btn.name}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-[25rem] py-3 border border-gray-300 rounded-md pl-[1rem] text-[1.5rem] focus:outline-none focus:border-cyan-500"
          placeholder="Tên nhân viên..."
        />
      </div>

      <div className="w-full overflow-x-auto rounded-[.8rem] border border-gray-200">
        <table className="w-full text-[1.5rem] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <th className="p-5 text-left font-medium border-r border-gray-200">
                Nhân viên
              </th>
              <th className="p-5 text-center font-medium border-r border-gray-200">
                Chức vụ
              </th>
              <th className="p-5 text-center font-medium border-r border-gray-200">
                Giờ vào
              </th>
              <th className="p-5 text-center font-medium border-r border-gray-200">
                Giờ ra
              </th>
              <th className="p-5 text-center font-medium border-r border-gray-200">
                Trạng thái
              </th>
              <th className="p-5 text-center font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="text-center py-[4rem] text-gray-400 text-[1.5rem]">
                    Không có nhân viên nào
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((staff) => {
                const att = staff.attendance;
                const status = att?.status || "ABSENT";
                return (
                  <tr
                    key={staff.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <td className="p-5 border-r border-gray-200">
                      <div className="flex items-center gap-[1rem]">
                        {staff.image ? (
                          <img
                            src={staff.image}
                            alt={staff.fullName}
                            className="w-[4rem] h-[4rem] rounded-full object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="w-[4rem] h-[4rem] rounded-full bg-blue-100 flex items-center justify-center text-[1.3rem] font-medium text-blue-700">
                            {staff.fullName.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium text-gray-800">
                          {staff.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="p-5 text-center border-r border-gray-200">
                      <span className="inline-flex items-center px-[1rem] py-[.3rem] rounded-full text-[1.3rem] font-medium bg-blue-50 text-blue-700 whitespace-nowrap">
                        {POSITION_OPTIONS.find(
                          (p) => p.value === staff.position,
                        )?.label || "—"}
                      </span>
                    </td>

                    <td className="p-5 text-center border-r border-gray-200">
                      {att?.checkIn ? (
                        <span
                          className={
                            status === "LATE"
                              ? "text-amber-600 font-medium"
                              : "text-gray-700"
                          }
                        >
                          {dayjs(att.checkIn).format("HH:mm")}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    <td className="p-5 text-center border-r border-gray-200">
                      {att?.checkOut ? (
                        <span className="text-gray-700">
                          {dayjs(att.checkOut).format("HH:mm")}
                        </span>
                      ) : att?.checkIn ? (
                        <span className="text-gray-400 italic text-[1.3rem]">
                          Chưa ra
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    <td className="p-5 text-center border-r border-gray-200">
                      <span
                        className={`inline-flex items-center px-[1rem] py-[.3rem] rounded-full text-[1.3rem] font-medium whitespace-nowrap ${
                          STATUS_COLOR_MAP[status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {STATUS_LABEL_MAP[status] || "—"}
                      </span>
                    </td>

                    <td className="py-5 px-0 text-center">
                      <div className="flex items-center justify-center gap-2.5">
                        <button
                          className="flex items-center gap-[.5rem] px-[1.4rem] py-[.7rem] rounded-[.6rem] bg-green-50 text-green-600 hover:bg-green-100 transition-colors cursor-pointer text-[1.4rem]"
                          onClick={() =>
                            handleChangeStatus(staff.id, "PRESENT")
                          }
                        >
                          <span>Đúng giờ</span>
                        </button>
                        <button
                          className="flex items-center gap-[.5rem] px-[1.4rem] py-[.7rem] rounded-[.6rem] bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer text-[1.4rem]"
                          onClick={() => handleChangeStatus(staff.id, "LATE")}
                        >
                          <span>Đi trể</span>
                        </button>
                        <button
                          onClick={() =>
                            setOpenReason({
                              open: true,
                              staff: staff,
                              status: "ABSENT",
                            })
                          }
                          className="flex items-center gap-[.5rem] px-[1.4rem] py-[.7rem] rounded-[.6rem] bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer text-[1.4rem]"
                        >
                          <span>Vắng</span>
                        </button>
                        <button
                          onClick={() =>
                            setOpenReason({
                              open: true,
                              staff: staff,
                              status: "LEAVE",
                            })
                          }
                          className="flex items-center gap-[.5rem] px-[1.4rem] py-[.7rem] rounded-[.6rem] bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer text-[1.4rem]"
                        >
                          <span>Nghĩ phép</span>
                        </button>
                        {att?.checkIn && !att?.checkOut && (
                          <button
                            onClick={() => handleCheckOut(att.id)}
                            className="flex items-center gap-[.5rem] px-[1.4rem] py-[.7rem] rounded-[.6rem] bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors cursor-pointer text-[1.4rem]"
                          >
                            Giờ ra
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {openReason.open && (
        <ReasonModal
          staff={openReason.staff}
          status={openReason.status}
          onClose={() =>
            setOpenReason({
              open: false,
              staff: null,
              status: null,
            })
          }
          onSuccess={refetch}
        />
      )}
    </div>
  );
}

export default Attendance;
