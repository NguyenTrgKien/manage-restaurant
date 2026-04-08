import supplierController from "../controller/supplier.controller.js";
import verifyToken from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import {
  validateSupplierData,
  validateSupplierDataUpdate,
} from "../validators/supplier.validate.js";

export default (router) => {
  router.get(
    "/api/v1/suppliers",
    verifyToken,
    supplierController.getAllSuppliers,
  );

  router.get(
    "/api/v1/suppliers/:id",
    verifyToken,
    supplierController.getSupplierById,
  );

  router.post(
    "/api/v1/suppliers",
    verifyToken,
    verifyAdmin,
    validateSupplierData,
    supplierController.createSupplier,
  );

  router.patch(
    "/api/v1/suppliers/:id",
    verifyToken,
    verifyAdmin,
    validateSupplierDataUpdate,
    supplierController.updateSupplier,
  );

  router.patch(
    "/api/v1/suppliers/:id/toggle",
    verifyToken,
    verifyAdmin,
    supplierController.toggleSupplier,
  );
};
