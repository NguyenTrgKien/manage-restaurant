import revenueController from "../controller/revenue.controller.js";

export default (router) => {
  router.get("/api/v1/get-monthly-revenue", revenueController.getWeekRevenue);

  router.post("/api/v1/get-revenue", revenueController.getWeeklyRevenue);

  router.get("/api/v1/get-year-revenue", revenueController.getYearRevenue);
};
