import staffController from "../controller/staff.controller.js";
import { upload } from "../config/cloudinaryConfig.js";
import {
  validateCreateStaff,
  validateUpdateStaff,
} from "../validators/staff.validator.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/authMiddleware.js";

export default (router) => {
  router.post(
    "/api/v1/staffs",
    verifyToken,
    verifyAdmin,
    upload.single("image"),
    validateCreateStaff,
    staffController.handleCreateStaff,
  );

  router.get("/api/v1/staffs", verifyToken, staffController.getAllStaff);

  router.get("/api/v1/staffs/:id", verifyToken, staffController.getStaffById);

  router.patch(
    "/api/v1/staffs/:id",
    verifyToken,
    verifyAdmin,
    upload.single("image"),
    validateUpdateStaff,
    staffController.handleUpdateStaff,
  );

  router.patch(
    "/api/v1/staffs/:id/status",
    verifyToken,
    verifyAdmin,
    staffController.handleChangeStatusStaff,
  );
};
