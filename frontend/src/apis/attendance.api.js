import axiosInstance from "../configs/axiosInstance";

export const getAttendanceByDate = async (date) => {
  return await axiosInstance.get("/api/v1/attendance", {
    params: { date },
  });
};

export const markAttendance = async ({ staffId, status, note = "" }) => {
  return await axiosInstance.patch(`/api/v1/attendance/${staffId}/mark`, {
    status,
    note,
  });
};

export const updateAttendance = async (id) => {
  return await axiosInstance.put(`/api/v1/attendance/${id}`);
};

export const checkOutAttendance = async (attendanceId) => {
  return await axiosInstance.patch(
    `/api/v1/attendance/${attendanceId}/checkout`,
  );
};

export const getQrToken = async () => {
  return await axiosInstance.get("/api/v1/attendance/qr-token");
};

export const scanQr = async (qrToken) => {
  return await axiosInstance.post("/api/v1/attendance/scan", {
    qrToken,
  });
};

export const checkAttendance = async () => {
  return await axiosInstance.get("/api/v1/attendance/today");
};
