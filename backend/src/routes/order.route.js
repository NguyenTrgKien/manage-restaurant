import orderController from "../controller/order.controller.js";
import verifyToken from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import {
  validateCheckOrderTableDish,
  validateCreateOrderDish,
  validateCreateOrderTable,
} from "../validators/order.validator.js";

export default (router) => {
  // order dish
  router.post(
    "/api/v1/orders/dishs",
    validateCreateOrderDish,
    orderController.handleOrderDish,
  );

  // router.patch(
  //   "/api/v1/orders/dishs/:id/cancel",
  //   verifyToken,
  //   orderController.handleCancelOrderDish,
  // );

  // router.patch(
  //   "/api/v1/orders/dishs/:id/status",
  //   verifyToken,
  //   verifyAdmin,
  //   orderController.handleUpdateOrderDishStatus,
  // );

  // router.get(
  //   "/api/v1/orders/dishs",
  //   verifyToken,
  //   verifyAdmin,
  //   orderController.getAllOrderDishForAdmin,
  // );

  // Order table
  router.post(
    "/api/v1/orders/table",
    validateCreateOrderTable,
    orderController.handleOrderTable,
  );

  // router.patch(
  //   "/api/v1/orders/table/:id/cancel",
  //   verifyToken,
  //   orderController.handleCancelOrderTable,
  // );

  // router.patch(
  //   "/api/v1/orders/table/:id/status",
  //   verifyToken,
  //   orderController.handleUpdateOrderTableStatus,
  // );

  // router.get(
  //   "/api/v1/orders/table",
  //   verifyToken,
  //   verifyAdmin,
  //   orderController.getAllOrderTableForAdmin,
  // );

  // router.get(
  //   "/api/v1/orders/table/date/:orderDate", // cập nhật date
  //   orderController.handleOrderTableDate,
  // );

  // router.post(
  //   "/api/v1/orders/check",
  //   validateCheckOrderTableDish,
  //   orderController.handleCheckOrderTableDist,
  // );

  // router.get(
  //   "/api/v1/orders/table/:id",
  //   verifyToken,
  //   verifyAdmin,
  //   orderController.getOrderTableById,
  // );
};
