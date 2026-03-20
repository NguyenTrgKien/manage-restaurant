import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VALID_STATUSES = ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"];

const tableService = {
  getAllTable: async () => {
    try {
      const tables = await prisma.table.findMany({
        include: { room: true },
        orderBy: { name: "asc" },
      });
      return {
        errCode: 0,
        message: "Lấy danh sách bàn thành công!",
        data: tables,
      };
    } catch (error) {
      console.error("[tableService.getAllTable]", error.message);
      return { errCode: 1, message: "Lỗi server!" };
    }
  },

  getTableById: async (id) => {
    try {
      const table = await prisma.table.findUnique({
        where: { id: Number(id) },
        include: { room: true },
      });
      if (!table) return { errCode: 1, message: "Bàn không tồn tại!" };
      return { errCode: 0, message: "Thành công!", data: table };
    } catch (error) {
      console.error("[tableService.getTableById]", error.message);
      return { errCode: 1, message: "Lỗi server!" };
    }
  },

  createTable: async ({ name, capacity, status, roomId }) => {
    try {
      if (!name?.trim())
        return { errCode: 1, message: "Vui lòng nhập tên bàn!" };
      if (!capacity || Number(capacity) < 1)
        return { errCode: 1, message: "Sức chứa phải lớn hơn 0!" };
      if (status && !VALID_STATUSES.includes(status))
        return { errCode: 1, message: "Trạng thái không hợp lệ!" };

      const existing = await prisma.table.findFirst({
        where: { name: name.trim() },
      });
      if (existing) return { errCode: 1, message: "Tên bàn đã tồn tại!" };

      if (roomId) {
        const room = await prisma.room.findUnique({
          where: { id: Number(roomId) },
        });
        if (!room) return { errCode: 1, message: "Phòng không tồn tại!" };
      }

      const table = await prisma.table.create({
        data: {
          name: name.trim(),
          capacity: Number(capacity),
          status: status ?? "AVAILABLE",
          roomId: roomId ? Number(roomId) : null,
        },
      });

      return { errCode: 0, message: "Tạo bàn thành công!", data: table };
    } catch (error) {
      console.error("[tableService.createTable]", error.message);
      return { errCode: 1, message: "Lỗi server!" };
    }
  },

  updateTable: async ({ id, name, capacity, status, roomId }) => {
    try {
      if (!id) return { errCode: 1, message: "Thiếu ID bàn!" };

      const current = await prisma.table.findUnique({
        where: { id: Number(id) },
      });
      if (!current) return { errCode: 1, message: "Bàn không tồn tại!" };

      if (name !== undefined && !name.trim())
        return { errCode: 1, message: "Tên bàn không được để trống!" };
      if (capacity !== undefined && Number(capacity) < 1)
        return { errCode: 1, message: "Sức chứa phải lớn hơn 0!" };
      if (status && !VALID_STATUSES.includes(status))
        return { errCode: 1, message: "Trạng thái không hợp lệ!" };

      if (name) {
        const duplicate = await prisma.table.findFirst({
          where: { name: name.trim(), NOT: { id: Number(id) } },
        });
        if (duplicate) return { errCode: 1, message: "Tên bàn đã tồn tại!" };
      }

      if (roomId) {
        const room = await prisma.room.findUnique({
          where: { id: Number(roomId) },
        });
        if (!room) return { errCode: 1, message: "Phòng không tồn tại!" };
      }

      const updated = await prisma.table.update({
        where: { id: Number(id) },
        data: {
          ...(name && { name: name.trim() }),
          ...(capacity && { capacity: Number(capacity) }),
          ...(status && { status }),
          ...(roomId !== undefined && {
            roomId: roomId ? Number(roomId) : null,
          }),
        },
      });

      return { errCode: 0, message: "Cập nhật bàn thành công!", data: updated };
    } catch (error) {
      console.error("[tableService.updateTable]", error.message);
      return { errCode: 1, message: "Lỗi server!" };
    }
  },

  toggleMaintenance: async (id) => {
    try {
      if (!id) return { errCode: 1, message: "Thiếu ID bàn!" };

      const current = await prisma.table.findUnique({
        where: { id: Number(id) },
      });
      if (!current) return { errCode: 1, message: "Bàn không tồn tại!" };

      if (current.status === "AVAILABLE") {
        const activeOrder = await prisma.orderTable.findFirst({
          where: {
            tableId: Number(id),
            status: { notIn: ["COMPLETED", "CANCELLED"] },
          },
        });
        if (activeOrder) {
          return {
            errCode: 1,
            message: "Không thể bảo trì! Bàn đang có đơn đặt chưa hoàn thành.",
          };
        }
      }

      const updated = await prisma.table.update({
        where: { id: Number(id) },
        data: {
          status: current.status === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE",
        },
      });

      return {
        errCode: 0,
        message:
          updated.status === "MAINTENANCE"
            ? "Bàn đã chuyển sang bảo trì!"
            : "Bàn đã hoạt động trở lại!",
        data: updated,
      };
    } catch (error) {
      console.error("[tableService.toggleMaintenance]", error.message);
      return { errCode: 1, message: "Lỗi server!" };
    }
  },
};

export default tableService;
