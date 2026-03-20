import {
  faChair,
  faFloppyDisk,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { STATUS_LIST } from ".";
import { createTable, updateTable } from "../../../apis/table.api";

function TableFormModal({ editData, onClose }) {
  const queryClient = useQueryClient();
  const isEdit = !!editData;

  const [name, setname] = useState(editData?.name ?? "");
  const [capacity, setCapacity] = useState(editData?.capacity ?? "");
  const [status, setStatus] = useState(editData?.status ?? "Còn trống");
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit
        ? updateTable({ tableId: editData.id, ...payload })
        : createTable(payload),
    onSuccess: (res) => {
      if (res?.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["tables"] });
        onClose();
      } else {
        setErrors({ server: res?.message || "Thao tác thất bại!" });
      }
    },
  });

  const handleSubmit = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Vui lòng nhập tên bàn!";
    if (!capacity || Number(capacity) < 1)
      newErrors.capacity = "Vui lòng nhập số lượng khách hợp lệ!";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    mutation.mutate({
      name: name.trim(),
      capacity: Number(capacity),
      status,
    });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#6060606d] z-[950]">
      <div className="w-[44rem] h-auto p-[3rem] rounded-[1rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between mb-[2.5rem]">
          <div className="flex items-center gap-[1rem]">
            <div className="w-[4rem] h-[4rem] rounded-[.8rem] bg-cyan-50 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faChair}
                className="text-cyan-500 text-[1.8rem]"
              />
            </div>
            <h3 className="text-[1.8rem] font-semibold text-gray-800">
              {isEdit ? "Chỉnh sửa bàn" : "Thêm bàn mới"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-[3.2rem] h-[3.2rem] flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-[1.8rem]" />
          </button>
        </div>

        <div className="space-y-[1.6rem]">
          <div>
            <label className="block text-[1.6rem] text-gray-600 mb-[.6rem]">
              Tên bàn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: Bàn 01, Bàn VIP..."
              value={name}
              onChange={(e) => {
                setname(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: "" }));
              }}
              className={`w-full h-[4.4rem] px-[1.2rem] border rounded-[.6rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem] ${errors.name ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.name && (
              <p className="text-red-500 text-[1.4rem] mt-[.4rem]">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[1.6rem] text-gray-600 mb-[.6rem]">
              Sức chứa <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              placeholder="Số lượng khách tối đa..."
              value={capacity}
              onChange={(e) => {
                setCapacity(e.target.value);
                if (errors.capacity) setErrors((p) => ({ ...p, capacity: "" }));
              }}
              className={`w-full h-[4.4rem] px-[1.2rem] border rounded-[.6rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem] ${errors.capacity ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.capacity && (
              <p className="text-red-500 text-[1.4rem] mt-[.4rem]">
                {errors.capacity}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[1.6rem] text-gray-600 mb-[.6rem]">
              Trạng thái
            </label>
            <div className="grid grid-cols-3 gap-[.8rem]">
              {STATUS_LIST.map((s) => {
                return (
                  <button
                    key={s.value}
                    onClick={() => setStatus(s.value)}
                    className={`h-[3.8rem] rounded-[.6rem] text-[1.4rem] font-medium border transition-all ${
                      status === s.value
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {errors.server && (
            <p className="text-red-500 text-[1.4rem]">{errors.server}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-[1rem] mt-[2.5rem]">
          <button
            onClick={onClose}
            className="px-[2.4rem] py-[1rem] rounded-[.8rem] bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-[1.6rem] cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="flex items-center gap-[.6rem] px-[2.4rem] py-[1rem] rounded-[.8rem] bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white text-[1.6rem] font-medium transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {mutation.isPending
              ? "Đang lưu..."
              : isEdit
                ? "Cập nhật"
                : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableFormModal;
