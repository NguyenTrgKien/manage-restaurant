import categoryController from "../controller/category.controller.js";

export default (router) => {
  router.get("/api/v1/get-category", categoryController.getAllCategory);

  router.post("/api/v1/create-category", categoryController.createCategory);

  router.put("/api/v1/update-category", categoryController.updateCategory);

  router.delete(
    "/api/v1/delete-category/:id",
    categoryController.deleteCategory,
  );
};
