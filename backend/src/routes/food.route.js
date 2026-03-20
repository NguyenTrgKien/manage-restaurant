import foodController from "../controller/food.controller.js";
import categoryController from "../controller/category.controller.js";
import {
  validateCreateFood,
  validateDeleteFood,
  validateEditFood,
} from "../validators/food.validator.js";
import { upload } from "../config/cloudinaryConfig.js";

export default (router) => {
  router.get("/api/v1/foods", foodController.getAllFood);

  router.post(
    "/api/v1/foods",
    upload.single("image"),
    validateCreateFood,
    foodController.handleCreateFood,
  );

  router.patch(
    "/api/v1/foods",
    upload.single("image"),
    validateEditFood,
    foodController.handleEditFood,
  );

  router.delete(
    "/api/v1/foods",
    validateDeleteFood,
    foodController.handleDeleteFood,
  );

  router.delete(
    "/api/v1/delete-category/:id",
    categoryController.deleteCategory,
  );
};
