import axiosInstance from "../configs/axiosInstance";

export const importStock = async (data) => {
  const res = await axiosInstance.post("/api/v1/inventory-receipts", data);
  return res;
};

export const updateStock = async (id, data) => {
  const res = await axiosInstance.patch(
    `/api/v1/inventory-receipts/${id}`,
    data,
  );
  return res;
};

export const getInventoryReceiptById = async (id) => {
  const res = await axiosInstance.get(`/api/v1/inventory-receipts/${id}`);
  return res.data;
};

export const getAllReceipt = async ({
  page,
  limit,
  supplierId,
  receiptDate,
  receiptCode,
  status,
}) => {
  const queryParams = {
    page,
    limit,
    ...(supplierId ? { supplierId } : {}),
    ...(receiptDate ? { receiptDate } : {}),
    ...(receiptCode ? { receiptCode } : {}),
    ...(status ? { status } : {}),
  };

  const res = await axiosInstance.get("/api/v1/inventory-receipts", {
    params: queryParams,
  });
  return res.data;
};

export const getReceiptById = async (id) => {
  const res = await axiosInstance.get(`/api/v1/inventory-receipts/${id}`);
  return res.data;
};

export const approveReceipt = async (id) => {
  const res = await axiosInstance.post(
    `/api/v1/inventory-receipts/${id}/approve`,
  );
  return res;
};

export const rejectReceipt = async (id, reason) => {
  const res = await axiosInstance.post(
    `/api/v1/inventory-receipts/${id}/reject`,
    { reason },
  );
  return res;
};

export const getAllTransactions = async ({
  page,
  limit,
  ingredientName,
  type,
  createdAt,
}) => {
  const queryParams = {
    page,
    limit,
    ...(ingredientName ? { ingredientName } : {}),
    ...(type ? { type } : {}),
    ...(createdAt ? { createdAt } : {}),
  };

  const res = await axiosInstance.get("/api/v1/inventory-transactions", {
    params: queryParams,
  });
  return res.data;
};

export const getAllInventory = async ({ limit, page, name }) => {
  const queryParams = { limit, page, ...(name ? { name } : {}) };
  const res = await axiosInstance.get(`/api/v1/inventories`, {
    params: queryParams,
  });
  return res.data;
};
