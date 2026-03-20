import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const foodService = {
  createFood: async (data, fileName) => {
    const { name, description, price, categoryId, quantity } = data;

    await prisma.food.create({
      data: {
        name,
        description: description ?? null,
        price: Number(price),
        image: fileName,
        categoryId: categoryId ? Number(categoryId) : null,
        quantity: Number(quantity),
      },
    });

    return { errCode: 0, message: "Tạo món ăn thành công!" };
  },

  getAllFood: async () => {
    const data = await prisma.food.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: { select: { id: true, name: true } } },
    });
    return { errCode: 0, message: "Success", data };
  },

  editFood: async (data, fileName) => {
    const { name, price, description, categoryId, foodId, quantity } = data;

    const food = await prisma.food.findUnique({
      where: { id: Number(foodId) },
    });
    if (!food) {
      return { errCode: 2, message: "Món ăn không tồn tại!" };
    }

    const updateData = {
      name,
      price: Number(price),
      description: description ?? null,
      categoryId: categoryId ? Number(categoryId) : null,
      quantity: Number(quantity),
    };

    if (fileName) updateData.image = fileName;

    await prisma.food.update({
      where: { id: Number(foodId) },
      data: updateData,
    });

    return { errCode: 0, message: "Cập nhật món ăn thành công!" };
  },

  deleteFood: async (foodId) => {
    const food = await prisma.food.findUnique({
      where: { id: Number(foodId) },
    });
    if (!food) {
      return { errCode: 2, message: "Món ăn không tồn tại!" };
    }

    await prisma.food.delete({ where: { id: Number(foodId) } });

    return {
      errCode: 0,
      message: "Xóa món ăn thành công!",
      deletedImage: food.image,
    };
  },
};

export default foodService;
