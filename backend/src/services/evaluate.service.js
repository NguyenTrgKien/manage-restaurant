import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const evaluateService = {
  handleEvaluateProduct: async (data) => {
    try {
      const evaluateData = data;
      if (!evaluateData.userId || !evaluateData.orderId) {
        return {
          errCode: 1,
          message: `Thiếu thông tin người dùng hoặc mã đơn hàng!`,
        };
      }
      if (
        !evaluateData ||
        typeof evaluateData !== "object" ||
        Object.keys(evaluateData.reviews).length === 0
      ) {
        return {
          errCode: 2,
          message: "Dữ liệu không hợp lệ!",
        };
      }

      const order = await prisma.order.finprismayPk(evaluateData.orderId);
      const user = await prisma.user.finprismayPk(evaluateData.userId);
      if (!user) {
        throw new Error(
          `Người dùng không tồn tại cho sản phẩm ${evaluateData.foodId}`,
        );
      }

      if (!order) {
        throw new Error(`Không tìm thấy đơn hàng ${evaluateData.orderId}`);
      }

      for (let evaluate of evaluateData.reviews) {
        if (
          !evaluate.scoreEvaluate ||
          evaluate.scoreEvaluate > 5 ||
          evaluate.scoreEvaluate < 1
        ) {
          throw new Error(`Số sao không hợp lệ cho món ${evaluate.foodId}`);
        }
        if (!evaluate.foodId) {
          throw new Error(`Thiếu foodId cho ${evaluate.foodId}`);
        }

        const food = await prisma.food.finprismayPk(evaluate.foodId);

        if (!food) {
          throw new Error(`Món ăn không tồn tại cho món ${evaluate.foodId}`);
        }
      }

      const reviewToSave = evaluateData.reviews.map((food) => {
        return {
          userId: evaluateData.userId,
          orderId: evaluateData.orderId,
          foodId: food.foodId,
          scoreEvaluate: food.scoreEvaluate,
          comment: food.comment || null,
        };
      });

      await prisma.evaluate.bulkCreate(reviewToSave, {
        validate: true,
      });

      return {
        errCode: 0,
        message: "Cập nhật thông tin đánh giá thành công!",
      };
    } catch (error) {
      throw Error(error);
    }
  },
  getEvaluateProduct: async (userId) => {
    try {
      if (!userId) {
        return {
          errCode: 1,
          message: "Vui lòng truyền đây đủ thông tin!",
        };
      }

      const evaluateData = await prisma.evaluate.findMany();

      if (!evaluateData) {
        return {
          errCode: 2,
          message: "Không tìm thấy đánh giá nào!",
        };
      }

      return {
        errCode: 0,
        message: "Lấy dữ liệu đánh giá thành công!",
        data: evaluateData,
      };
    } catch (error) {
      throw Error(error);
    }
  },
  getEvaluateDetailProduct: async (foodId) => {
    try {
      if (!foodId) {
        return {
          errCode: 1,
          message: "Vui lòng truyền đây đủ thông tin!",
        };
      }

      const evaluateData = await prisma.evaluate.findMany({
        where: {
          foodId: foodId,
        },
        attributes: ["scoreEvaluate", "userId", "comment", "createdAt"],
        include: [
          {
            model: prisma.User,
            attributes: ["fullName", "image"],
          },
        ],
      });
      const totalReviews = evaluateData.length;
      const everageEvaluate =
        evaluateData.length > 0
          ? evaluateData.reduce((acc, curr) => {
              return acc + Number(curr.scoreEvaluate);
            }, 0) / totalReviews
          : 0;

      console.log(everageEvaluate);
      return {
        errCode: 0,
        message: "Lấy dữ liệu đánh giá của sản phẩm thành công!",
        everageEvaluate: everageEvaluate.toFixed(1),
        data: evaluateData,
      };
    } catch (error) {
      throw Error(error);
    }
  },
};

export default evaluateService;
