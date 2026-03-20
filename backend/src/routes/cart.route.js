import cartController from "../controller/cart.controller.js";

export default (router) => {
  router.get("/api/v1/get-cart/:userId", cartController.getCart);

  router.post("/api/v1/add-product-cart", cartController.handleAddProductCart);

  router.put("/api/v1/update-all-cart", cartController.handleUpdateAllCart);

  router.put(
    "/api/v1/update-quantity-order-cart",
    cartController.handleUpdateQuantityOrderCart,
  );

  router.delete(
    "/api/v1/delete-product-cart",
    cartController.handleDeleteProductCart,
  );

  router.delete("/api/v1/delete-all-cart", cartController.handleDeleteAllCart);
};
