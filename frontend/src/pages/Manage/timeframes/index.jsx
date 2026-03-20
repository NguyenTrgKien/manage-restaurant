import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faClock,
  faPenToSquare,
  faToggleOff,
  faToggleOn,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import TimeframeFormModal from "./TimeframeFormModal";
import TimeframeDeleteModal from "./TimeframeToggleModal";
import { getAllTimeframe } from "../../../apis/timeframe.api";
import TimeframeToggleModal from "./TimeframeToggleModal";

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-200">
      <td className="p-5">
        <div className="h-[1.4rem] w-[3rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[8rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[8rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[2.4rem] w-[14rem] rounded-full bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="flex gap-[.8rem]">
          <div className="h-[3rem] w-[8rem] rounded-[.5rem] bg-gray-200" />
          <div className="h-[3rem] w-[7rem] rounded-[.5rem] bg-gray-200" />
        </div>
      </td>
    </tr>
  );
}

function Timeframe() {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [toggleData, setToggleData] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");

  const { data: tfRes, isLoading } = useQuery({
    queryKey: ["timeframes"],
    queryFn: getAllTimeframe,
  });
  console.log(tfRes);

  const timeframes = [...(tfRes?.data ?? [])].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  const filtered = timeframes.filter((tf) => {
    const q = searchFilter.toLowerCase();
    return (
      tf.startTime.includes(q) ||
      tf.endTime.includes(q) ||
      `${tf.startTime} – ${tf.endTime}`.includes(q)
    );
  });

  const handleOpenCreate = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleOpenEdit = (tf) => {
    setEditData(tf);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditData(null);
  };

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Quản lý khung giờ
          </h3>
          <p className="text-gray-500">
            Quản lý toàn bộ khung giờ phục vụ của nhà hàng.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center space-x-2 px-8 py-4 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors text-white text-[1.6rem]"
        >
          <FontAwesomeIcon icon={faAdd} />
          <span>Thêm khung giờ</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <input
          type="text"
          placeholder="Tìm khung giờ..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full h-[4.2rem] px-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
        />
      </div>

      <div className="w-full overflow-x-auto rounded-[.8rem] border border-gray-200">
        <table className="w-full text-[1.6rem] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left border-b border-gray-200">
              <th className="p-5 font-medium border-r border-gray-200 w-[6rem]">
                STT
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Giờ bắt đầu
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Giờ kết thúc
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Trạng thái
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Khung giờ
              </th>
              <th className="p-5 font-medium text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="text-center py-[4rem] text-gray-400 text-[1.6rem]">
                    Không có khung giờ nào
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((tf, idx) => (
                <tr
                  key={tf.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                >
                  <td className="p-5 text-gray-500 border-r border-gray-200">
                    {idx + 1}
                  </td>
                  <td className="p-5 font-medium text-gray-800 border-r border-gray-200">
                    {tf.startTime}
                  </td>
                  <td className="p-5 font-medium text-gray-800 border-r border-gray-200">
                    {tf.endTime}
                  </td>
                  <td className="p-5 border-r border-gray-200">
                    {tf.isActive ? (
                      <span className="inline-flex items-center gap-[.5rem] bg-green-100 text-green-700 text-[1.5rem] font-medium px-[1.2rem] py-[.4rem] rounded-full whitespace-nowrap">
                        <FontAwesomeIcon icon={faToggleOn} />
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-[.5rem] bg-gray-100 text-gray-500 text-[1.5rem] font-medium px-[1.2rem] py-[.4rem] rounded-full whitespace-nowrap">
                        <FontAwesomeIcon icon={faToggleOff} />
                        Đã tắt
                      </span>
                    )}
                  </td>
                  <td className="p-5 border-r border-gray-200">
                    <span className="inline-flex items-center gap-[.6rem] bg-cyan-50 text-cyan-700 text-[1.5rem] font-medium px-[1.2rem] py-[.4rem] rounded-full whitespace-nowrap">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-[1.3rem]"
                      />
                      {tf.startTime} – {tf.endTime}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex items-center justify-center gap-[.8rem]">
                      <button
                        onClick={() => handleOpenEdit(tf)}
                        className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-blue-50 text-blue-600 text-[1.6rem] rounded-[.6rem] cursor-pointer hover:bg-blue-100 transition-colors whitespace-nowrap"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                        Sửa
                      </button>
                      <button
                        onClick={() => setToggleData(tf)}
                        className={`flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] text-[1.6rem] rounded-[.6rem] cursor-pointer transition-colors whitespace-nowrap ${
                          tf.isActive
                            ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={tf.isActive ? faToggleOff : faToggleOn}
                        />
                        {tf.isActive ? "Tắt" : "Bật"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <TimeframeFormModal editData={editData} onClose={handleCloseForm} />
      )}

      {toggleData && (
        <TimeframeToggleModal
          toggleData={toggleData}
          onClose={() => setToggleData(null)}
        />
      )}
    </div>
  );
}

export default Timeframe;
