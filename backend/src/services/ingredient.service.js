import { PrismaClient } from "@prisma/client";
import AppError from "../common/httpStatusConfig.js";

const prisma = new PrismaClient();

const ingredientService = {
  create: async (data) => {
    return await prisma.$transaction(async (tx) => {
      const { name, description, unit, categoryId, minStock } = data;

      const existIngre = await tx.ingredient.findFirst({
        where: {
          name,
          unit,
          categoryId,
        },
      });

      if (existIngre) {
        throw new AppError("Nguyên liệu này đã tồn tại!", 400);
      }

      const newIngredient = await tx.ingredient.create({
        data: {
          name,
          description,
          unit,
          categoryId,
          minStock,
        },
      });

      await tx.inventory.create({
        data: {
          ingredientId: newIngredient.id,
          quantity: 0,
          avgPrice: 0,
          lastUpdatedAt: new Date(),
        },
      });

      return newIngredient;
    });
  },

  updateIngredient: async (id, data) => {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: Number(id) },
    });
    if (!ingredient) {
      throw new AppError("Nguyên liệu không tồn tại!", 404);
    }

    const updatedIngredient = await prisma.ingredient.update({
      where: { id: Number(id) },
      data,
    });

    return updatedIngredient;
  },

  getAllIngredient: async (query) => {
    const { page = 1, limit = 20, name, categoryId } = query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (name) {
      where.name = name;
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    const ingredients = await prisma.ingredient.findMany({
      where,
      include: {
        inventory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limitNum,
      skip,
    });

    return ingredients;
  },
};

export default ingredientService;
