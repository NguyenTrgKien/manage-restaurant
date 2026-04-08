import foodController from "../controller/food.controller.js";
import categoryController from "../controller/category.controller.js";
import {
  validateCreateFood,
  validateEditFood,
} from "../validators/food.validator.js";
import { upload } from "../config/cloudinaryConfig.js";
import verifyToken from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

export default (router) => {
  router.get("/api/v1/foods", foodController.getAllFood);

  router.post(
    "/api/v1/foods",
    verifyToken,
    upload.single("image"),
    validateCreateFood,
    foodController.handleCreateFood,
  );

  router.patch(
    "/api/v1/foods/:id",
    verifyToken,
    upload.single("image"),
    validateEditFood,
    foodController.handleEditFood,
  );

  router.patch(
    "/api/v1/foods/:id/toggle",
    verifyToken,
    foodController.toggleFood,
  );

  router.delete(
    "/api/v1/delete-category/:id",
    verifyToken,
    verifyAdmin,
    categoryController.deleteCategory,
  );
};
