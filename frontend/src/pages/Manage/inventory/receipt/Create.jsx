import { useQuery } from "@tanstack/react-query";
import { getAllSuppliers } from "../../../../apis/supplier.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { importStock } from "../../../../apis/inventory.api";
import { useNavigate } from "react-router";
import SelectIngredient from "./SelectIngredient";

function StockIn() {
  const navigate = useNavigate();
  const [dataRequest, setDataRequest] = useState({
    supplierId: "",
    note: "",
    items: [],
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openSelectIngredient, setOpenSelectIngredient] = useState(false);
  const { data: dataSuppliers, isLoading: isLoadingSupplier } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getAllSuppliers,
  });
  const suppliers = dataSuppliers?.data || [];

  const handleRemoveItem = (ingredientId) => {
    setDataRequest((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.ingredientId !== ingredientId),
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[`item_${ingredientId}_quantity`];
      delete next[`item_${ingredientId}_unitPrice`];
      delete next[`item_${ingredientId}_manufactureDate`];
      delete next[`item_${ingredientId}_expiryAt`];
      return next;
    });
  };

  const handleSupplierChange = (e) => {
    const value = e.target.value;
    setDataRequest((prev) => ({
      ...prev,
      supplierId: value,
    }));
    if (value) {
      setErrors((prev) => ({
        ...prev,
        supplierId: null,
      }));
    }
  };

  const handleItemChange = (ingredientId, field, value) => {
    const updated = dataRequest.items.map((item) => {
      if (item.ingredientId !== ingredientId) return item;

      let newValue = value;

      if (field === "quantity" || field === "unitPrice") {
        newValue = Number(value);
      }

      return { ...item, [field]: newValue };
    });
    setDataRequest((prev) => ({ ...prev, items: updated }));

    if ((field === "quantity" || field === "unitPrice") && Number(value) > 0) {
      setErrors((prev) => ({
        ...prev,
        [`item_${ingredientId}_${field}`]: null,
      }));
    }
    if (field === "manufactureDate" || field === "expiryAt") {
      setErrors((prev) => ({
        ...prev,
        [`item_${ingredientId}_${field}`]: null,
      }));
    }
  };

  const validateData = (data) => {
    const newErrors = {};
    let isValid = true;

    if (!data.supplierId) {
      newErrors.supplierId = "Vui lòng chọn nhà cung cấp!";
      isValid = false;
    }

    if (data.items.length === 0) {
      newErrors.isItems = "Vui lòng chọn ít nhất một nguyên liệu!";
      isValid = false;
    } else {
      data.items.forEach((item) => {
        if (!item.quantity || item.quantity <= 0) {
          newErrors[`item_${item.ingredientId}_quantity`] =
            "Số lượng phải lớn hơn 0!";
          isValid = false;
        }
        if (!item.unitPrice || item.unitPrice <= 0) {
          newErrors[`item_${item.ingredientId}_unitPrice`] =
            "Giá phải lớn hơn 0!";
          isValid = false;
        }
        if (!item.manufactureDate) {
          newErrors[`item_${item.ingredientId}_manufactureDate`] =
            "Vui lòng chọn ngày sx!";
          isValid = false;
        }
        if (!item.expiryAt) {
          newErrors[`item_${item.ingredientId}_expiryAt`] =
            "Vui lòng chọn ngày hết hạn!";
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleStockIn = async () => {
    if (!validateData(dataRequest)) {
      return;
    }
    const data = {
      supplierId: Number(dataRequest.supplierId),
      note: dataRequest.note,
      items: dataRequest.items.map((it) => ({
        expiryAt: it.expiryAt,
        ingredientId: it.ingredientId,
        manufactureDate: it.manufactureDate,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      })),
    };

    try {
      setIsLoading(true);
      const res = await importStock(data);
      setDataRequest({
        supplierId: "",
        note: "",
        items: [],
      });
      toast.success(res.data.message || "Tạo hóa đơn nhập kho thành công!");
      navigate("/manage/inventory-receipts");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div className="max-w-6xl h-auto mx-auto bg-white rounded-md p-10 shadow-md">
        <h2 className="text-[2.2rem] font-semibold text-gray-800 mb-10 text-center">
          Nhập hàng mới vào kho
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="space-y-8">
            <div>
              <label className="block text-gray-700 mb-2">Nhà cung cấp</label>
              <select
                name="supplierId"
                id="supplierId"
                value={dataRequest.supplierId}
                onChange={handleSupplierChange}
                className="w-full px-4 h-[4.2rem] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {isLoadingSupplier ? (
                  <option>Đang tải dữ liệu</option>
                ) : suppliers.length > 0 ? (
                  suppliers
                    .filter((it) => it.status === "active")
                    .map((s) => {
                      return (
                        <option key={s.id} value={s.id}>
                          {s.phone}-{s.name}
                        </option>
                      );
                    })
                ) : (
                  <option value="">Không có nhà cung cấp nào</option>
                )}
              </select>
              {errors.supplierId && (
                <p className="text-red-500 text-[1.4rem] mt-1">
                  {errors.supplierId}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Ghi chú</label>
              <textarea
                name="note"
                id="note"
                placeholder="Nhập ghi chú..."
                value={dataRequest.note}
                onChange={(e) =>
                  setDataRequest((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }))
                }
                rows={3}
                className="w-full p-5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div
              className="w-full h-[4.2rem] border border-dashed flex items-center justify-center gap-2 cursor-pointer select-none"
              onClick={() => setOpenSelectIngredient(true)}
            >
              <FontAwesomeIcon icon={faAdd} />
              <span>Chọn nguyên liệu</span>
            </div>
            {errors.isItems && (
              <p className="text-red-500 text-[1.4rem]">{errors.isItems}</p>
            )}

            <div>
              <p className="mb-5">Danh sách nguyên liệu đã chọn</p>
              <div className="flex flex-col gap-5">
                {dataRequest.items.length > 0 ? (
                  dataRequest.items.map((f) => {
                    return (
                      <div
                        key={f.ingredientId}
                        className="flex items-center justify-between p-5 border border-gray-300 rounded-md"
                      >
                        <div>
                          <p className="line-clamp-1 max-w-[15rem] mb-4 font-bold">
                            {f.name}
                          </p>
                          <div className="flex space-x-4">
                            <div className="inline-flex flex-col">
                              <label htmlFor="quantity" className="block mb-2">
                                Số lượng
                              </label>
                              <input
                                type="number"
                                name="quantity"
                                placeholder="Số lượng"
                                className="w-[20rem] h-[4rem] rounded-md border border-gray-300 px-5"
                                value={f.quantity || ""}
                                onChange={(e) =>
                                  handleItemChange(
                                    f.ingredientId,
                                    "quantity",
                                    e.target.value,
                                  )
                                }
                              />
                              {errors[`item_${f.ingredientId}_quantity`] && (
                                <span className="text-red-500 text-[1.4rem] mt-1">
                                  {errors[`item_${f.ingredientId}_quantity`]}
                                </span>
                              )}
                            </div>
                            <div className="inline-flex flex-col">
                              <label htmlFor="unitPrice" className="block mb-2">
                                Giá nhập
                              </label>
                              <input
                                type="text"
                                name="unitPrice"
                                placeholder="Vd: 25.000"
                                className="w-[20rem] h-[4rem] rounded-md border border-gray-300 px-5"
                                value={
                                  f.unitPrice
                                    ? Intl.NumberFormat("vi-Vn").format(
                                        f.unitPrice,
                                      )
                                    : ""
                                }
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(
                                    /\./g,
                                    "",
                                  );
                                  handleItemChange(
                                    f.ingredientId,
                                    "unitPrice",
                                    rawValue,
                                  );
                                }}
                              />
                              {errors[`item_${f.ingredientId}_unitPrice`] && (
                                <span className="text-red-500 text-[1.4rem] mt-1">
                                  {errors[`item_${f.ingredientId}_unitPrice`]}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-4 mt-4">
                            <div className="inline-flex flex-col">
                              <label
                                htmlFor="manufactureDate"
                                className="block mb-2"
                              >
                                Ngày sản xuất
                              </label>
                              <input
                                type="date"
                                name="manufactureDate"
                                value={f.manufactureDate || ""}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) => {
                                  handleItemChange(
                                    f.ingredientId,
                                    "manufactureDate",
                                    e.target.value,
                                  );
                                }}
                                className="w-[20rem] h-[4rem] rounded-md border border-gray-300 px-5"
                              />
                              {errors[
                                `item_${f.ingredientId}_manufactureDate`
                              ] && (
                                <span className="text-red-500 text-[1.4rem] mt-1">
                                  {
                                    errors[
                                      `item_${f.ingredientId}_manufactureDate`
                                    ]
                                  }
                                </span>
                              )}
                            </div>
                            <div className="inline-flex flex-col">
                              <label htmlFor="expiryAt" className="block mb-2">
                                Ngày hết hạn
                              </label>
                              <input
                                type="date"
                                name="expiryAt"
                                value={f.expiryAt || ""}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => {
                                  handleItemChange(
                                    f.ingredientId,
                                    "expiryAt",
                                    e.target.value,
                                  );
                                }}
                                className="w-[20rem] h-[4rem] rounded-md border border-gray-300 px-5"
                              />
                              {errors[`item_${f.ingredientId}_expiryAt`] && (
                                <span className="text-red-500 text-[1.4rem] mt-1">
                                  {errors[`item_${f.ingredientId}_expiryAt`]}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <button
                            className="w-12 h-12 bg-red-100 rounded-md hover:bg-red-200 outline-none"
                            onClick={() => handleRemoveItem(f.ingredientId)}
                          >
                            <FontAwesomeIcon
                              icon={faTrashCan}
                              className="text-red-500"
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10">Chưa chọn nguyên liệu</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-[1rem] mt-10">
              <button
                type="button"
                className="px-4 py-2.5 bg-blue-500 text-white hover:bg-blue-600 rounded-md cursor-pointer transition-all duration-[.25s]"
                onClick={handleStockIn}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Nhập hàng"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {openSelectIngredient && (
          <SelectIngredient
            selectedIngredient={dataRequest.items}
            setSelectedIngredient={(items) =>
              setDataRequest((prev) => ({ ...prev, items }))
            }
            onClose={() => setOpenSelectIngredient(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default StockIn;
