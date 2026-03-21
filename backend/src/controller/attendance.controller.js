import attendanceService from "../services/attendance.service.js";

const attendanceController = {
  getAttendanceByDate: async (req, res) => {
    try {
      const { date } = req.query;
      const result = await attendanceService.getAttendanceByDate(date);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  markAttendance: async (req, res) => {
    try {
      const { staffId } = req.params;
      const { status, note } = req.body;

      const result = await attendanceService.markAttendance(
        staffId,
        status,
        note,
      );

      return res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  updateAttendance: async (req, res) => {
    try {
      const { attendanceId } = req.params;
      const result = await attendanceService.updateAttendance(
        attendanceId,
        req.body,
      );
      return res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },

  checkOut: async (req, res) => {
    try {
      const { attendanceId } = req.params;
      const result = await attendanceService.checkOut(attendanceId, req.body);
      return res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },
  generateQRToken: async (req, res) => {
    try {
      const token = await attendanceService.generateQRToken();
      return res.status(200).json({ errCode: 0, data: { token } });
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },
  scanQR: async (req, res) => {
    try {
      const staffId = req.user.id;
      const { qrToken } = req.body;
      console.log("qrToken", qrToken);

      if (!qrToken) {
        return res.status(400).json({ errCode: 1, message: "Thiếu mã QR!" });
      }

      const result = await attendanceService.scanQR(staffId, qrToken);
      return res.status(result.errCode === 0 ? 200 : 400).json(result);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Server Error!" });
    }
  },
};

export default attendanceController;
