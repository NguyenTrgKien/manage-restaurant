import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

dayjs.extend(utc);
dayjs.extend(timezone);
const TZ = "Asia/Ho_Chi_Minh";
const startOfDay = (date) =>
  dayjs.tz(dayjs(date).format("YYYY-MM-DD"), TZ).startOf("day").toDate();

const endOfDay = (date) =>
  dayjs.tz(dayjs(date).format("YYYY-MM-DD"), TZ).endOf("day").toDate();

const attendanceService = {
  getAttendanceByDate: async (date) => {
    try {
      const targetDate = date || dayjs().tz(TZ).format("YYYY-MM-DD");
      const staffList = await prisma.staff.findMany({
        where: {
          status: "WORKING",
        },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              image: true,
            },
          },
          attendances: {
            where: {
              date: {
                gte: startOfDay(targetDate),
                lte: endOfDay(targetDate),
              },
            },
            take: 1,
          },
        },
        orderBy: {
          user: { fullName: "asc" },
        },
      });

      const result = staffList.map((staff) => ({
        id: staff.id,
        fullName: staff.user.fullName,
        email: staff.user.email,
        image: staff.user.image,
        position: staff.position,
        attendance: staff.attendances[0] || null,
      }));

      return {
        errCode: 0,
        message: "Success",
        data: result,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  markAttendance: async (staffId, status, note = "") => {
    try {
      const VALID_STATUS = ["PRESENT", "LATE", "ABSENT", "LEAVE"];
      if (!VALID_STATUS.includes(status)) {
        return { errCode: 1, message: "Trạng thái không hợp lệ!" };
      }

      const staff = await prisma.staff.findUnique({
        where: { id: Number(staffId) },
      });

      if (!staff) {
        return { errCode: 2, message: "Không tìm thấy nhân viên!" };
      }

      const today = new Date();

      const isPresent = status === "PRESENT" || status === "LATE";

      const existing = await prisma.attendance.findUnique({
        where: {
          staffId_date: {
            staffId: Number(staffId),
            date: startOfDay(today),
          },
        },
      });

      const attendance = await prisma.attendance.upsert({
        where: {
          staffId_date: {
            staffId: Number(staffId),
            date: startOfDay(today),
          },
        },
        update: {
          status,
          note,
          ...(isPresent && !existing?.checkIn && { checkIn: today }),
          ...(!isPresent && { checkIn: null, checkOut: null }),
        },
        create: {
          date: startOfDay(today),
          checkIn: isPresent ? today : null,
          checkOut: null,
          status,
          note,
          staff: {
            connect: { id: Number(staffId) },
          },
        },
      });

      return {
        errCode: 0,
        message: "Cập nhật chấm công thành công!",
        data: attendance,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  updateAttendance: async (attendanceId, data) => {
    try {
      const { checkIn, checkOut, status, note } = data;

      const VALID_STATUS = ["PRESENT", "LATE", "ABSENT", "LEAVE"];
      if (status && !VALID_STATUS.includes(status)) {
        return { errCode: 1, message: "Trạng thái không hợp lệ!" };
      }

      const attendance = await prisma.attendance.findUnique({
        where: { id: Number(attendanceId) },
      });

      if (!attendance) {
        return { errCode: 2, message: "Không tìm thấy bản ghi chấm công!" };
      }

      if (checkIn && checkOut) {
        if (dayjs(checkOut).isBefore(dayjs(checkIn))) {
          return { errCode: 3, message: "Giờ ra phải sau giờ vào!" };
        }
      }

      const updated = await prisma.attendance.update({
        where: { id: Number(attendanceId) },
        data: {
          ...(checkIn !== undefined && {
            checkIn: checkIn ? new Date(checkIn) : null,
          }),
          ...(checkOut !== undefined && {
            checkOut: checkOut ? new Date(checkOut) : null,
          }),
          ...(status && { status }),
          ...(note !== undefined && { note }),
        },
      });

      return {
        errCode: 0,
        message: "Cập nhật chấm công thành công!",
        data: updated,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  markAbsent: async (staffId, note = "") => {
    try {
      const today = new Date();

      const existing = await prisma.attendance.findUnique({
        where: {
          staffId_date: {
            staffId: Number(staffId),
            date: startOfDay(today),
          },
        },
      });

      if (existing) {
        return {
          errCode: 1,
          message: "Nhân viên đã có bản ghi chấm công hôm nay!",
        };
      }

      const attendance = await prisma.attendance.create({
        data: {
          staffId: Number(staffId),
          date: startOfDay(today),
          checkIn: null,
          checkOut: null,
          status: "ABSENT",
          note,
        },
      });

      return {
        errCode: 0,
        message: "Đã đánh dấu vắng mặt!",
        data: attendance,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  checkOut: async (attendanceId) => {
    const attendance = await prisma.attendance.findUnique({
      where: { id: Number(attendanceId) },
    });

    if (!attendance) return { errCode: 1, message: "Không tìm thấy bản ghi!" };
    if (!attendance.checkIn)
      return { errCode: 2, message: "Chưa chấm công vào!" };
    if (attendance.checkOut)
      return { errCode: 3, message: "Đã chấm công ra rồi!" };

    const updated = await prisma.attendance.update({
      where: { id: Number(attendanceId) },
      data: { checkOut: new Date() },
    });

    return { errCode: 0, message: "Chấm công ra thành công!", data: updated };
  },

  generateQRToken: async () => {
    const token = jwt.sign(
      {
        date: dayjs().tz(TZ).format("YYYY-MM-DD"),
        type: "attendance-checkin",
      },
      process.env.QR_SECRET,
      { expiresIn: "5m" },
    );
    return token;
  },

  scanQR: async (staffId, qrToken) => {
    try {
      let decoded;
      try {
        decoded = jwt.verify(qrToken, process.env.QR_SECRET);
      } catch (error) {
        if (err.name === "TokenExpiredError") {
          return {
            errCode: 1,
            message: "Mã QR đã hết hạn, vui lòng quét lại!",
          };
        }
        return { errCode: 2, message: "Mã QR không hợp lệ!" };
      }

      const today = dayjs().tz(TZ).format("YYYY-MM-DD");
      if (decoded.date !== today) {
        return {
          errCode: 3,
          message: "Mã QR không đúng ngày hôm nay!",
        };
      }

      const staff = await prisma.staff.findUnique({
        where: { id: Number(staffId) },
        include: { user: { select: { fullName: true } } },
      });

      if (!staff) {
        return { errCode: 4, message: "Không tìm thấy nhân viên!" };
      }

      const existing = await prisma.attendance.findUnique({
        where: {
          staffId_date: {
            staffId: Number(staffId),
            date: startOfDay(today),
          },
        },
      });

      if (existing?.checkIn && !existing.checkOut) {
        const updated = await prisma.attendance.update({
          where: { id: existing.id },
          data: { checkOut: new Date() },
        });

        return {
          errCode: 0,
          type: "checkOut",
          message: `Chấm công ra thành công! Xin chào ${staff.user.fullName}`,
          data: updated,
        };
      }

      if (existing?.checkIn && existing?.checkOut) {
        return { errCode: 5, message: "Bạn đã chấm công đủ hôm nay rồi!" };
      }

      const isLate = dayjs()
        .tz(TZ)
        .isAfter(dayjs().tz(TZ).startOf("day").hour(8).minute(0));

      const attendance = await prisma.attendance.create({
        data: {
          date: startOfDay(today),
          checkIn: new Date(),
          status: isLate ? "LATE" : "PRESENT",
          staff: { connect: { id: Number(staffId) } },
        },
      });

      return {
        errCode: 0,
        type: "checkin",
        message: `Chấm công  vào thành công! Xin chào ${staff.user.fullName}`,
        data: attendance,
      };
    } catch (error) {
      throw new Error("Lỗi server!");
    }
  },

  checkAttendanceToday: async (staffId) => {
    try {
      const today = new Date();
      const staff = await prisma.user.findUnique({
        where: {
          id: Number(staffId),
        },
      });

      if (!staff) {
        return {
          errCode: 1,
          message: "Không tìm thấy người dùng này!",
        };
      }

      const attendance = await prisma.attendance.findUnique({
        where: {
          staffId_date: {
            staffId: staffId,
            date: startOfDay(today),
          },
        },
      });

      if (!attendance) {
        return {
          errCode: 0,
          status: "not_checked_in",
          message: "Bạn chưa chấm công hôm nay",
          data: null,
        };
      }

      if (attendance.checkIn && !attendance.checkOut) {
        return {
          errCode: 0,
          status: "checked_in",
          message: "Bạn đã check-in, chưa check-out",
          data: {
            checkIn: attendance.checkIn,
            checkOut: null,
          },
        };
      }

      if (attendance.checkIn && attendance.checkOut) {
        return {
          errCode: 0,
          status: "completed",
          message: "Bạn đã hoàn thành chấm công hôm nay",
          data: {
            checkIn: attendance.checkIn,
            checkOut: attendance.checkOut,
          },
        };
      }
    } catch (error) {
      throw new Error("Lỗi server!");
    }
  },
};

export default attendanceService;
