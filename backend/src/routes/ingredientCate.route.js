import verifyToken from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import ingredientCateController from "../controller/ingredientCate.controller.js";

export default (router) => {
  router.get("/api/v1/ingredient-categories", ingredientCateController.getAll);

  router.post(
    "/api/v1/ingredient-categories",
    verifyToken,
    verifyAdmin,
    ingredientCateController.create,
  );
};
