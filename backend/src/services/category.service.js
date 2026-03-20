import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoryService = {
  getAllCategory: async () => {
    const data = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { foods: true } },
      },
    });
    return { errCode: 0, message: "Success", data };
  },

  createCategory: async ({ name }) => {
    if (!name?.trim()) {
      return { errCode: 1, message: "Tên danh mục không được để trống" };
    }

    const existed = await prisma.category.findFirst({
      where: { name: { equals: name.trim(), mode: "insensitive" } },
    });
    if (existed) {
      return { errCode: 2, message: "Tên danh mục đã tồn tại" };
    }

    const data = await prisma.category.create({
      data: { name: name.trim() },
    });
    return { errCode: 0, message: "Tạo danh mục thành công", data };
  },

  updateCategory: async ({ id, name }) => {
    if (!id) {
      return { errCode: 1, message: "Thiếu id danh mục" };
    }
    if (!name?.trim()) {
      return { errCode: 1, message: "Tên danh mục không được để trống" };
    }

    const existed = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!existed) {
      return { errCode: 3, message: "Danh mục không tồn tại" };
    }

    const duplicate = await prisma.category.findFirst({
      where: {
        name: { equals: name.trim(), mode: "insensitive" },
        NOT: { id: Number(id) },
      },
    });
    if (duplicate) {
      return { errCode: 2, message: "Tên danh mục đã tồn tại" };
    }

    const data = await prisma.category.update({
      where: { id: Number(id) },
      data: { name: name.trim() },
    });
    return { errCode: 0, message: "Cập nhật danh mục thành công", data };
  },

  deleteCategory: async (id) => {
    if (!id) {
      return { errCode: 1, message: "Thiếu id danh mục" };
    }

    const existed = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!existed) {
      return { errCode: 3, message: "Danh mục không tồn tại" };
    }

    const foodCount = await prisma.food.count({
      where: { categoryId: Number(id) },
    });
    if (foodCount > 0) {
      return {
        errCode: 4,
        message: `Không thể xóa! Danh mục còn ${foodCount} món ăn`,
      };
    }

    await prisma.category.delete({ where: { id: Number(id) } });
    return { errCode: 0, message: "Xóa danh mục thành công" };
  },
};

export default categoryService;
