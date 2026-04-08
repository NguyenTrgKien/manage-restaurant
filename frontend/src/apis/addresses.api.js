import axiosInstance from "../configs/axiosInstance";

export const getAllAddress = async () => {
  const res = await axiosInstance.get("/api/v1/addresses");
  return res.data.data;
};
