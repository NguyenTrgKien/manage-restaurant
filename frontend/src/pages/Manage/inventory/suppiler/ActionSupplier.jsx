import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axiosInstance from "../../../../configs/axiosInstance";
import { useEffect, useState } from "react";

function ActionSupplier({ action, dataUpdate, onClose, refetch }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (action === "edit" && dataUpdate) {
      setFormData({
        name: dataUpdate.name || "",
        email: dataUpdate.email || "",
        phone: dataUpdate.phone || "",
        address: dataUpdate.address || "",
      });
    }
  }, [dataUpdate, action]);

  const validateForm = () => {
    let isValid = true;

    if (!formData.name.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        name: "Vui lòng nhập tên nhà cung cấp.",
      }));
      isValid = false;
    }
    if (formData.email.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        email: "Vui lòng nhập email.",
      }));
      isValid = false;
    } else if (formData.email === "") {
      setErrors((prev) => ({
        ...prev,
        email: "Vui lòng nhập email hợp lệ.",
      }));
      isValid = false;
    }
    if (formData.phone.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        phone: "Vui lòng nhập số điện thoại.",
      }));
      isValid = false;
    } else if (formData.phone === "") {
      setErrors((prev) => ({
        ...prev,
        phone: "Vui lòng nhập số điện thoại hợp lệ (10 chữ số).",
      }));
      isValid = false;
    }

    if (formData.address.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        address: "Vui lòng nhập địa chỉ.",
      }));
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      await handleCreateSupplier();
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSupplier = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/api/v1/suppliers", formData);
      await refetch();
      toast.success(res.data.message || "Thêm nhà cung cấp thành công.");
      onClose();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[200] bg-[#4e4e4e4b]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-[60rem] h-auto relative bg-[#fff] rounded-[1rem] p-[2rem]"
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="text-[1.8rem] absolute top-[1rem] right-[1rem] p-[.5rem] bg-[#e6e6e6] text-[#767676] rounded-[.5rem] cursor-pointer"
          onClick={onClose}
        />
        <h2 className="text-[2.2rem] font-semibold text-gray-800 mb-10">
          {action === "create"
            ? "Thêm nhà cung cấp mới"
            : "Cập nhật thông tin nhà cung cấp"}
        </h2>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-8">
            <div className="w-full">
              <label className="block text-gray-700 mb-2">
                Tên nhà cung cấp
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="VD: Nguyễn Văn A"
                className="border border-gray-300 rounded-md h-[4.2rem] px-5 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                onFocus={() => setErrors((prev) => ({ ...prev, name: "" }))}
                onChange={handleChangeInput}
              />
              <p className="text-red-500 text-[1.4rem] mt-1">{errors.name}</p>
            </div>

            <div className="w-full">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                placeholder="VD: nguyenvana@gmail.com"
                className="border border-gray-300 rounded-md h-[4.2rem] px-5 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                onFocus={() => setErrors((prev) => ({ ...prev, email: "" }))}
                onChange={handleChangeInput}
              />
              <p className="text-red-500 text-[1.4rem] mt-1">{errors.email}</p>
            </div>

            <div className="w-full">
              <label className="block text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                placeholder="VD: 0123456789"
                className="border border-gray-300 rounded-md h-[4.2rem] px-5 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                onFocus={() => setErrors((prev) => ({ ...prev, phone: "" }))}
                onChange={handleChangeInput}
              />
              <p className="text-red-500 text-[1.4rem] mt-1">{errors.phone}</p>
            </div>

            <div className="w-full">
              <label className="block text-gray-700 mb-2">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                placeholder="VD: 123 Đường ABC, Quận XYZ"
                className="border border-gray-300 rounded-md h-[4.2rem] px-5 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                onFocus={() => setErrors((prev) => ({ ...prev, address: "" }))}
                onChange={handleChangeInput}
              />
              <p className="text-red-500 text-[1.4rem] mt-1">
                {errors.address}
              </p>
            </div>
          </div>
          <p className="text-red-500 text-[1.4rem] mt-2">{errorMessage}</p>
          <div className="flex items-center justify-end gap-[1rem] mt-10">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md cursor-pointer transition-all duration-[.25s]"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md cursor-pointer transition-all duration-[.25s]"
              disabled={isLoading}
            >
              {isLoading
                ? "Đang xử lý..."
                : action === "create"
                  ? "Thêm"
                  : "Cập nhật"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default ActionSupplier;
