import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const timeframeService = {
  create: async (data) => {
    try {
      const { startTime, endTime } = data;

      if (!startTime || !endTime) {
        return {
          errCode: 1,
          message: "Vui lòng nhập đầy đủ giờ bắt đầu và kết thúc!",
        };
      }

      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return {
          errCode: 1,
          message:
            "Định dạng giờ không hợp lệ! Vui lòng nhập theo định dạng HH:mm",
        };
      }

      if (startTime >= endTime) {
        return { errCode: 1, message: "Giờ kết thúc phải sau giờ bắt đầu!" };
      }

      const existing = await prisma.timeFrame.findFirst({
        where: { startTime, endTime },
      });

      if (existing) {
        return { errCode: 1, message: "Khung giờ này đã tồn tại!" };
      }

      const overlapping = await prisma.timeFrame.findFirst({
        where: {
          OR: [
            { startTime: { lte: startTime }, endTime: { gt: startTime } },
            { startTime: { lt: endTime }, endTime: { gte: endTime } },
            { startTime: { gte: startTime }, endTime: { lte: endTime } },
          ],
        },
      });

      if (overlapping) {
        return {
          errCode: 1,
          message: `Khung giờ bị trùng với khung giờ đã có: ${overlapping.startTime} – ${overlapping.endTime}`,
        };
      }

      const timeframe = await prisma.timeFrame.create({
        data: { startTime, endTime },
      });

      return {
        errCode: 0,
        message: "Tạo khung giờ thành công!",
        data: timeframe,
      };
    } catch (error) {
      console.error("[timeframeService.create]", error.message);
      return { errCode: 1, message: "Lỗi server!" };
    }
  },
  getAllTimeframe: async () => {
    try {
      const timeframes = await prisma.timeFrame.findMany();

      return {
        errCode: 0,
        message: "Lấy danh sách khung giờ thành công!",
        data: timeframes,
      };
    } catch (error) {
      console.error("[timeframeService.getAllTimeframe]", error.message);
      return { errCode: 1, message: "Lỗi server!" };
    }
  },
  updateTimeframe: async (id, data) => {
    try {
      const { startTime, endTime } = data;

      if (!id) {
        return { errCode: 1, message: "Thiếu ID khung giờ!" };
      }

      if (!startTime || !endTime) {
        return {
          errCode: 1,
          message: "Vui lòng nhập đầy đủ giờ bắt đầu và kết thúc!",
        };
      }

      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return {
          errCode: 1,
          message:
            "Định dạng giờ không hợp lệ! Vui lòng nhập theo định dạng HH:mm",
        };
      }

      if (startTime >= endTime) {
        return { errCode: 1, message: "Giờ kết thúc phải sau giờ bắt đầu!" };
      }

      const current = await prisma.timeFrame.findUnique({
        where: { id: Number(id) },
      });

      if (!current) {
        return { errCode: 1, message: "Khung giờ không tồn tại!" };
      }

      const duplicate = await prisma.timeFrame.findFirst({
        where: {
          startTime,
          endTime,
          NOT: { id: Number(id) },
        },
      });

      if (duplicate) {
        return { errCode: 1, message: "Khung giờ này đã tồn tại!" };
      }

      const overlapping = await prisma.timeFrame.findFirst({
        where: {
          NOT: { id: Number(id) },
          OR: [
            { startTime: { lte: startTime }, endTime: { gt: startTime } },
            { startTime: { lt: endTime }, endTime: { gte: endTime } },
            { startTime: { gte: startTime }, endTime: { lte: endTime } },
          ],
        },
      });

      if (overlapping) {
        return {
          errCode: 1,
          message: `Khung giờ bị trùng với khung giờ đã có: ${overlapping.startTime} – ${overlapping.endTime}`,
        };
      }

      const updated = await prisma.timeFrame.update({
        where: { id: Number(id) },
        data: { startTime, endTime },
      });

      return {
        errCode: 0,
        message: "Cập nhật khung giờ thành công!",
        data: updated,
      };
    } catch (error) {
      console.error("[timeframeService.updateTimeframe]", error.message);
      return { errCode: 1, message: "Lỗi server!" };
    }
  },
  toggleTimeframe: async (id) => {
    const current = await prisma.timeFrame.findUnique({
      where: { id: Number(id) },
    });

    if (!current) {
      return { errCode: 1, message: "Khung giờ không tồn tại!" };
    }

    const updated = await prisma.timeFrame.update({
      where: { id: Number(id) },
      data: { isActive: !current.isActive },
    });

    return {
      errCode: 0,
      message: updated.isActive ? "Đã bật khung giờ!" : "Đã tắt khung giờ!",
      data: updated,
    };
  },
};

export default timeframeService;
