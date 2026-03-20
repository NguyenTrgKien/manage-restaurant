import axiosInstance from "../configs/axiosInstance";

export const createTimeframe = async (data) => {
  return await axiosInstance.post("/api/v1/timeframes", data);
};

export const getAllTimeframe = async () => {
  const res = await axiosInstance.get("/api/v1/timeframes");
  return res?.data ?? null;
};

export const updateTimeframe = async ({ id, ...data }) => {
  return await axiosInstance.patch(`/api/v1/timeframes/${id}`, data);
};

export const toggleTimeframe = async (id) => {
  return await axiosInstance.patch(`/api/v1/timeframes/${id}/toggle`);
};
