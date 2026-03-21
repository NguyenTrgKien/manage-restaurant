import attendanceController from "../controller/attendance.controller.js";
import verifyToken from "../middlewares/authMiddleware.js";

export default (router) => {
  router.get("/api/v1/attendance", attendanceController.getAttendanceByDate);

  router.patch(
    "/api/v1/attendance/:staffId/mark",
    attendanceController.markAttendance,
  );

  router.put(
    "/api/v1/attendance/:attendanceId",
    attendanceController.updateAttendance,
  );

  router.patch(
    "/api/v1/attendance/:attendanceId/checkout",
    attendanceController.checkOut,
  );

  router.get(
    "/api/v1/attendance/qr-token",
    attendanceController.generateQRToken,
  );

  router.post(
    "/api/v1/attendance/scan",
    verifyToken,
    attendanceController.scanQR,
  );

  router.get(
    "/api/v1/attendance/today",
    verifyToken,
    attendanceController.checkAttendanceToday,
  );
};
