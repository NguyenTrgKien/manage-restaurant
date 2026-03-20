import orderController from "../controller/order.controller.js";
import verifyToken from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import {
  validateCreateOrder,
  validateCheckOrderTableDish,
} from "../validators/order.validator.js";

export default (router) => {
  router.post(
    "/api/v1/orders",
    validateCreateOrder,
    orderController.handleOrder,
  );

  router.patch(
    "/api/v1/orders/:orderId/cancel",
    verifyToken,
    orderController.handleCancelOrder,
  );

  router.patch(
    "/api/v1/orders/:orderId/status",
    verifyToken,
    verifyAdmin,
    orderController.handleUpdateOrderStatus,
  );

  router.get(
    "/api/v1/orders/admin",
    verifyToken,
    verifyAdmin,
    orderController.getAllOrderForAdmin,
  );

  router.post("/api/v1/order-tables", orderController.handleOrderTable);

  router.patch(
    "/api/v1/order-tables/:orderTableId/cancel",
    verifyToken,
    orderController.handleCancelOrderTable,
  );

  router.patch(
    "/api/v1/order-tables/:orderTableId/status",
    verifyToken,
    verifyAdmin,
    orderController.handleUpdateOrderTableStatus,
  );

  router.get(
    "/api/v1/order-tables/admin",
    verifyToken,
    verifyAdmin,
    orderController.getAllOrderTableForAdmin,
  );

  router.get(
    "/api/v1/order-tables/date/:orderDate",
    orderController.handleOrderTableDate,
  );

  router.get(
    "/api/v1/order-tables/user/:userId",
    verifyToken,
    orderController.getUserOrderTableHistory,
  );

  router.post(
    "/api/v1/orders/check-table",
    validateCheckOrderTableDish,
    orderController.handleCheckOrderTableDist,
  );

  router.get(
    "/api/v1/order-table/:id",
    verifyToken,
    verifyAdmin,
    orderController.getOrderTableById,
  );
};
