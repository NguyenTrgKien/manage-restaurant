import verifyToken from "../middlewares/authMiddleware.js";
import ingredientController from "../controller/ingredient.controller.js";
import { createIngredientValidator } from "../validators/ingredient.validate.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

export default (router) => {
  router.get("/api/v1/ingredients", ingredientController.getAllIngredient);

  router.post(
    "/api/v1/ingredients",
    verifyToken,
    verifyAdmin,
    createIngredientValidator,
    ingredientController.create,
  );

  // router.get("/api/v1/ingredients/:id", ingredientController.getIngredientById);

  router.patch(
    "/api/v1/ingredients/:id",
    verifyToken,
    verifyAdmin,
    createIngredientValidator,
    ingredientController.updateIngredient,
  );
};
