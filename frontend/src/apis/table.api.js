import axiosInstance from "../configs/axiosInstance";

export const getAllTable = async () => {
  return await axiosInstance.get("/api/v1/tables");
};

export const createTable = async (data) => {
  return await axiosInstance.post("/api/v1/tables", data);
};

export const updateTable = async ({ tableId, ...data }) => {
  return await axiosInstance.patch(`/api/v1/tables/${tableId}`, data);
};

export const toggleMaintenanceTable = async (id) => {
  return await axiosInstance.patch(`/api/v1/tables/${id}`);
};
