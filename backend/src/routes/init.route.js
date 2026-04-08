import express from "express";
import authRoutes from "./auth.route.js";
import cartRoutes from "./cart.route.js";
import userRoutes from "./user.route.js";
import foodRoutes from "./food.route.js";
import staffRoutes from "./staff.route.js";
import paymentRoutes from "./payment.route.js";
import orderRoutes from "./order.route.js";
import tableRoutes from "./table.route.js";
import evaluateRoutes from "./evaluate.route.js";
import revenueRoutes from "./revenue.route.js";
import categoryRouter from "./category.route.js";
import timeframeRoute from "./timeframe.route.js";
import attendanceRoute from "./attendance.route.js";
import customerRoute from "./customer.route.js";
import addressRoutes from "./address.route.js";
import suppliersRoute from "./suppliers.route.js";
import ingredientRoute from "./ingredient.route.js";
import ingredientCateRoute from "./ingredientCate.route.js";
import inventoryRoute from "./inventory.route.js";
const router = express.Router();

const initRoute = (app) => {
  authRoutes(router);
  cartRoutes(router);
  userRoutes(router);
  foodRoutes(router);
  categoryRouter(router);
  staffRoutes(router);
  paymentRoutes(router);
  orderRoutes(router);
  tableRoutes(router);
  evaluateRoutes(router);
  revenueRoutes(router);
  timeframeRoute(router);
  attendanceRoute(router);
  customerRoute(router);
  addressRoutes(router);
  suppliersRoute(router);
  ingredientRoute(router);
  ingredientCateRoute(router);
  inventoryRoute(router)

  return app.use("/", router);
};

export default initRoute;
