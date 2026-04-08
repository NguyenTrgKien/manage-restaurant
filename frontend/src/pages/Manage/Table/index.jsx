import {
  faAdd,
  faCheckCircle,
  faClock,
  faPenToSquare,
  faTrash,
  faUtensils,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TableFormModal from "./TableFormModal";
import TableDeleteModal from "./TableDeleteModal";
import { getAllTable, updateTable } from "../../../apis/table.api";
import { useAuth } from "../../../hooks/useAuth";

export const STATUS_LIST = [
  {
    value: "AVAILABLE",
    label: "Còn trống",
    badge: "bg-green-100 text-green-700",
    icon: faCheckCircle,
    iconColor: "text-green-500",
  },
  {
    value: "RESERVED",
    label: "Đã được đặt",
    badge: "bg-yellow-100 text-yellow-700",
    icon: faClock,
    iconColor: "text-yellow-500",
  },
  {
    value: "OCCUPIED",
    label: "Đang sử dụng",
    badge: "bg-red-100 text-red-700",
    icon: faUtensils,
    iconColor: "text-red-500",
  },
  {
    value: "MAINTENANCE",
    label: "Bảo trì",
    badge: "bg-gray-100 text-gray-500",
    icon: faWrench,
    iconColor: "text-gray-400",
  },
];

const getStatus = (value) =>
  STATUS_LIST.find((s) => s.value === value) ?? STATUS_LIST[0];

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-200">
      <td className="p-5">
        <div className="h-[1.4rem] w-[3rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[10rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[1.4rem] w-[6rem] rounded bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="h-[2.4rem] w-[12rem] rounded-full bg-gray-200" />
      </td>
      <td className="p-5">
        <div className="flex gap-[.8rem]">
          <div className="h-[3rem] w-[7rem] rounded-[.5rem] bg-gray-200" />
          <div className="h-[3rem] w-[7rem] rounded-[.5rem] bg-gray-200" />
        </div>
      </td>
    </tr>
  );
}

function Table() {
  const user = useAuth();
  const queryClient = useQueryClient();
  const [searchTable, setSearchTable] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const { data: tableRes, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getAllTable,
  });

  const tables = [...(tableRes?.data?.data ?? [])].sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? ""),
  );

  const filtered = tables.filter((t) =>
    (t.name ?? "").toLowerCase().includes(searchTable.toLowerCase()),
  );
  const statusMutation = useMutation({
    mutationFn: ({ tableId, status }) => {
      return updateTable({ tableId, status });
    },
    onSuccess: (res) => {
      console.log(res);
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });

  const handleOpenCreate = () => {
    setEditData(null);
    setShowForm(true);
  };
  const handleOpenEdit = (t) => {
    setEditData(t);
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
          <h3 className="text-[2.2rem]  text-gray-800">Quản lý bàn</h3>
          <p className="text-gray-500">Quản lý toàn bộ bàn ăn của nhà hàng.</p>
        </div>
        {user.role !== "admin" && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center space-x-2 px-8 py-4 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors text-white text-[1.6rem]"
          >
            <FontAwesomeIcon icon={faAdd} />
            <span>Thêm bàn</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-5">
        <input
          type="text"
          placeholder="Tìm tên bàn..."
          value={searchTable}
          onChange={(e) => setSearchTable(e.target.value)}
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
                Tên bàn
              </th>
              <th className="p-5 font-medium border-r border-gray-200 w-[12rem]">
                Sức chứa
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Trạng thái
              </th>
              <th className="p-5 font-medium border-r border-gray-200">
                Cập nhật trạng thái
              </th>
              {user.role === "admin" && (
                <th className="p-5 font-medium text-center">Thao tác</th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="text-center py-[4rem] text-gray-400 text-[1.6rem]">
                    Không có bàn nào
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((table, idx) => {
                const s = getStatus(table.status);
                return (
                  <tr
                    key={table.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <td className="p-5 text-gray-500 border-r border-gray-200">
                      {idx + 1}
                    </td>
                    <td className="p-5  text-gray-800 border-r border-gray-200">
                      {table.name}
                    </td>
                    <td className="p-5 text-gray-500 border-r border-gray-200">
                      {table.capacity ?? "—"} người
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      <span
                        className={`inline-flex items-center gap-[.6rem] text-[1.5rem] font-medium px-[1.2rem] py-[.4rem] rounded-full whitespace-nowrap ${s.badge}`}
                      >
                        <FontAwesomeIcon
                          icon={s.icon}
                          className={s.iconColor}
                        />
                        {s.label}
                      </span>
                    </td>
                    <td className="p-5 border-r border-gray-200">
                      <div className="flex items-center gap-[.6rem]">
                        {STATUS_LIST.map((st) => (
                          <button
                            key={st.value}
                            disabled={
                              table.status === st.value ||
                              statusMutation.isPending
                            }
                            onClick={() =>
                              statusMutation.mutate({
                                tableId: table.id,
                                status: st.value,
                              })
                            }
                            className={`px-[1rem] py-[.4rem] rounded-full border text-[1.3rem] transition-all whitespace-nowrap disabled:cursor-not-allowed ${
                              table.status === st.value
                                ? `${st.badge} border-transparent `
                                : "bg-white text-gray-500 border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </td>
                    {user.role === "admin" && (
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-[.8rem]">
                          <button
                            onClick={() => handleOpenEdit(table)}
                            className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-blue-50 text-blue-600 text-[1.6rem] rounded-[.6rem] cursor-pointer hover:bg-blue-100 transition-colors whitespace-nowrap"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                            Sửa
                          </button>
                          <button
                            onClick={() => setDeleteData(table)}
                            className="flex items-center gap-[.5rem] px-[1.5rem] h-[3.2rem] bg-red-50 text-red-500 text-[1.6rem] rounded-[.6rem] cursor-pointer hover:bg-red-100 transition-colors whitespace-nowrap"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            Xóa
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <TableFormModal editData={editData} onClose={handleCloseForm} />
      )}
      {deleteData && (
        <TableDeleteModal
          deleteData={deleteData}
          onClose={() => setDeleteData(null)}
        />
      )}
    </div>
  );
}

export default Table;
