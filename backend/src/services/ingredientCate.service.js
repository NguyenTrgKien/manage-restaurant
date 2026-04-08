import { PrismaClient } from "@prisma/client";
import AppError from "../common/httpStatusConfig.js";
import slugify from "slugify";

const prisma = new PrismaClient();

const ingredientCateService = {
  generateSlug: async (name) => {
    const baseSlug = slugify(name, {
      lower: true,
      strict: false,
      locale: "vi",
      trim: true,
    });

    let slug = baseSlug;
    let count = 1;
    while (true) {
      const existing = await prisma.ingredientCategory.findUnique({
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
  create: async (data) => {
    const { name } = data;

    const existIngre = await prisma.ingredientCategory.findFirst({
      where: {
        name,
      },
    });

    if (existIngre) {
      throw new AppError("Danh mục nguyên liệu này đã tồn tại!", 400);
    }

    const slug = await ingredientCateService.generateSlug(name);
    console.log(slug);

    const newIngredient = prisma.ingredientCategory.create({
      data: {
        name,
        slug,
      },
    });

    return newIngredient;
  },

  getAll: async () => {
    const ingredientCates = await prisma.ingredientCategory.findMany({});

    return ingredientCates;
  },
};

export default ingredientCateService;
