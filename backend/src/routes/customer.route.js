import customerController from "../controller/customer.controller.js";
import verifyToken from "../middlewares/authMiddleware.js";

export default (router) => {
  router.get(
    "/api/v1/customers",
    verifyToken,
    customerController.getAllCustomer,
  );

  router.get(
    "/api/v1/customers/phone",
    verifyToken,
    customerController.getCustomerByPhone,
  );

  router.get(
    "/api/v1/customers/:id",
    verifyToken,
    customerController.getCustomerById,
  );

  router.get(
    "/api/v1/customers/:id/orders",
    verifyToken,
    customerController.getCustomerOrders,
  );
};
