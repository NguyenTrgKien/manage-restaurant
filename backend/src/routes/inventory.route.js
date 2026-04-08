import verifyToken from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { importStockValidator } from "../validators/inventory.validate.js";
import inventoryController from "../controller/inventory.controller.js";

export default (router) => {
  router.post(
    "/api/v1/inventory-receipts",
    verifyToken,
    verifyAdmin,
    importStockValidator,
    inventoryController.importStock,
  );

  router.patch(
    "/api/v1/inventory-receipts/:id",
    verifyToken,
    verifyAdmin,
    importStockValidator,
    inventoryController.updateStock,
  );

  router.get(
    "/api/v1/inventories",
    verifyToken,
    verifyAdmin,
    inventoryController.getAllInventory,
  );

  router.get("/api/v1/inventory-receipts", inventoryController.getAllReceipt);

  router.get(
    "/api/v1/inventory-receipts/:id",
    inventoryController.getReceiptById,
  );

  router.post(
    "/api/v1/inventory-receipts/:id/approve",
    verifyToken,
    verifyAdmin,
    inventoryController.approveReceipt,
  );

  router.post(
    "/api/v1/inventory-receipts/:id/reject",
    verifyToken,
    verifyAdmin,
    inventoryController.rejectReceipt,
  );

  router.get(
    "/api/v1/inventory-transactions",
    verifyToken,
    verifyAdmin,
    inventoryController.getTransactions,
  );

  router.get(
    "/api/v1/inventory-transactions/:id",
    verifyToken,
    verifyAdmin,
    inventoryController.getTransactionById,
  );
};
