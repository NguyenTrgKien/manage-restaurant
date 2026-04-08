import axiosInstance from "../configs/axiosInstance";

export const getAllSuppliers = async () => {
  const res = await axiosInstance.get("/api/v1/suppliers");
  return res.data;
};
