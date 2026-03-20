import userController from "../controller/user.controller.js";
import upload from "../config/multerConfig.js";

export default (router) => {
  router.get("/api/v1/get-profile-user/:userId", userController.getProfileUser);

  router.put(
    "/api/v1/update-profile-user",
    upload.single("image"),
    userController.handleUpdateProfileUser,
  );

  router.post(
    "/api/v1/create-admin",
    upload.single("image"),
    userController.handleCreateAdmin,
  );

  router.get(
    "/api/v1/get-user-order-history/:userId",
    userController.getAllUserOrderHistory,
  );

  router.get(
    "/api/v1/get-order-table-for-user/:userId",
    userController.getDetailOrderTableForUser,
  );

  router.get(
    "/api/v1/get-detail-order/:orderId",
    userController.getDetailOrder,
  );

  router.get(
    "/api/v1/get-detail-order-table/:orderTableId",
    userController.getDetailOrderTable,
  );

  router.get(
    "/api/v1/get-all-order-dish-for-admin",
    userController.getAllOrderDishForAdmin,
  );

  router.get(
    "/api/v1/get-all-order-table-dish-for-admin",
    userController.getAllOrderTableDishForAdmin,
  );

  router.put("/api/v1/auth-payment", userController.handleAuthpayment);
};
