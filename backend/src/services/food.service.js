import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();
const foodService = {
  generateUniqueSlug: async (name) => {
    const baseSlug = slugify(name, {
      lower: true,
      strict: false,
      locale: "vi",
      trim: true,
    });
    let slug = baseSlug;
    let count = 1;
    while (true) {
      const existing = await prisma.food.findUnique({
        where: {
          slug,
        },
      });

      if (!existing) break;
      slug = `${baseSlug}-${count}`;
      count++;
    }
    return slug;
  },
  createFood: async (data, fileName) => {
    const { name, description, price, categoryId } = data;

    const slug = await foodService.generateUniqueSlug(name);

    const food = await prisma.food.create({
      data: {
        name,
        description: description ?? null,
        price: Number(price),
        image: fileName,
        categoryId: categoryId ? Number(categoryId) : null,
        stock: 0,
        slug,
        inventory: {
          create: {
            quantity: 0,
            cost_price: 0,
            min_quantity: 5,
            max_quantity: 100,
            last_update_at: new Date(),
          },
        },
      },
    });

    return food;
  },

  getAllFood: async (queryFood) => {
    const { name, price = "asc", limit = 10, page = 1, isActive } = queryFood;
    const limitNum = Number(limit);
    const pageNum = Number(page);
    const skip = (pageNum - 1) * limitNum;
    const where = {};

    if (name) {
      where.name = name;
    }

    if (isActive) {
      where.isActive = isActive === "true";
    }

    const data = await prisma.food.findMany({
      where,
      orderBy: [{ price: price }, { createdAt: "asc" }],
      include: { category: { select: { id: true, name: true } } },
      take: limitNum,
      skip,
    });
    return { errCode: 0, message: "Success", data };
  },
  
  editFood: async (id, data, fileName) => {
    const { name, price, description, categoryId } = data;

    const food = await prisma.food.findUnique({
      where: { id },
    });
    if (!food) {
      return { errCode: 2, message: "Món ăn không tồn tại!" };
    }

    const updateData = {
      price: Number(price),
      description: description ?? null,
      categoryId: categoryId ? Number(categoryId) : null,
      name,
      ...(name ? { slug: await foodService.generateUniqueSlug(name) } : {}),
    };

    if (fileName) updateData.image = fileName;

    await prisma.food.update({
      where: { id },
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

  toggleFood: async (id) => {
    const food = await prisma.food.findUnique({
      where: { id },
    });
    if (!food) {
      throw new AppError("Không tìm thấy món ăn!", 404);
    }

    await prisma.food.update({
      where: { id },
      data: {
        isActive: !food.isActive,
      },
    });

    return {
      message: `${food.isActive ? "Đã ngừng" : "Đã mở"} hoạt động món ăn!`,
    };
  },
};

export default foodService;
