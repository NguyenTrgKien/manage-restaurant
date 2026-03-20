import axiosInstance from "../configs/axiosInstance";

export const createOrder = async (data) => {
  const res = await axiosInstance.post("/api/v1/orders", data);
  return res?.data ?? null;
};

export const cancelOrder = async ({ orderId, reason }) => {
  const res = await axiosInstance.patch(`/api/v1/orders/${orderId}/cancel`, {
    reason,
  });
  return res?.data ?? null;
};

export const updateOrderStatus = async ({ orderId, status }) => {
  const res = await axiosInstance.patch(`/api/v1/orders/${orderId}/status`, {
    status,
  });
  return res?.data ?? null;
};

export const getAllOrderForAdmin = async () => {
  const res = await axiosInstance.get("/api/v1/orders/admin");
  return res?.data ?? null;
};

export const createOrderTable = async (data) => {
  const res = await axiosInstance.post("/api/v1/order-tables", data);
  return res?.data ?? null;
};

export const cancelOrderTable = async ({ orderTableId, reason }) => {
  const res = await axiosInstance.patch(
    `/api/v1/order-tables/${orderTableId}/cancel`,
    { reason },
  );
  return res?.data ?? null;
};

export const updateOrderTableStatus = async ({ orderTableId, status }) => {
  const res = await axiosInstance.patch(
    `/api/v1/order-tables/${orderTableId}/status`,
    { status },
  );
  return res?.data ?? null;
};

export const getAllOrderTableForAdmin = async () => {
  const res = await axiosInstance.get("/api/v1/order-tables/admin");
  return res?.data ?? null;
};

export const getUserOrderTableHistory = async (userId) => {
  const res = await axiosInstance.get(`/api/v1/order-tables/user/${userId}`);
  return res?.data ?? null;
};

export const getOrderTableByDate = async (orderDate) => {
  const res = await axiosInstance.get(`/api/v1/order-tables/date/${orderDate}`);
  return res?.data ?? null;
};

export const checkOrderTableDist = async (data) => {
  const res = await axiosInstance.post("/api/v1/orders/check-table", data);
  return res?.data ?? null;
};

export const getOrderTableById = async (id) => {
  const res = await axiosInstance.get(`/api/v1/order-table/${id}`);
  return res?.data ?? null;
};
