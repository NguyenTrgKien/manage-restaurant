import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const revenueService = {
  getWeeklyRevenue: async (year, month, week) => {
    try {
      const startDate = new Date(year, month - 1, (week - 1) * 7 + 1);
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const endDate = new Date(
        year,
        month - 1,
        Math.min(week * 7, lastDayOfMonth),
      );

      endDate.setHours(23, 59, 59, 999);

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: {
            in: ["PAID", "COMPLETED"],
          },
        },
        select: {
          totalAmount: true,
          createdAt: true,
          userId: true,
        },
      });

      const weekDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      const revenueMap = {};

      for (const day of weekDays) {
        revenueMap[day] = 0;
      }

      for (const order of orders) {
        const day = new Date(order.createdAt).toLocaleDateString("en-US", {
          weekday: "long",
        });

        revenueMap[day] += Number(order.totalAmount);
      }

      const formattedRevenueData = weekDays.map((day) => ({
        day,
        revenue: revenueMap[day],
      }));

      const numOrder = orders.length;

      const numCustomer = new Set(orders.map((o) => o.userId)).size;

      return {
        errCode: 0,
        revenueData: formattedRevenueData,
        numCustomer,
        numOrder,
      };
    } catch (error) {
      console.log(error);

      throw new Error("Không thể lấy dữ liệu doanh thu");
    }
  },

  getYearRevenue: async () => {
    try {
      const result = await prisma.order.findFirst({
        orderBy: {
          createdAt: "asc",
        },
        select: {
          createdAt: true,
        },
      });

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (!result) {
        return {
          errCode: 0,
          message: "Lấy dữ liệu thành công!",
          year: currentYear,
          month: currentMonth,
        };
      }

      const minDate = new Date(result.createdAt);

      const startYear = minDate.getFullYear();
      const startMonth = minDate.getMonth() + 1;

      const years = [];

      for (let year = startYear; year <= currentYear; year++) {
        let months;

        if (year === startYear) {
          months = Array.from(
            { length: 13 - startMonth },
            (_, i) => startMonth + i,
          );
        } else if (year === currentYear) {
          months = Array.from({ length: currentMonth }, (_, i) => i + 1);
        } else {
          months = Array.from({ length: 12 }, (_, i) => i + 1);
        }

        years.push({
          year,
          months,
        });
      }

      return {
        errCode: 0,
        years,
      };
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },
};

export default revenueService;
