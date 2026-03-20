import evaluateController from "../controller/evaluate.controller.js";

export default (router) => {
  router.post(
    "/api/v1/post-evaluate-product",
    evaluateController.handleEvaluateProduct,
  );

  router.get(
    "/api/v1/get-evaluate-product/:userId",
    evaluateController.getEvaluateProduct,
  );

  router.get(
    "/api/v1/get-evaluate-detail-product/:foodId",
    evaluateController.getEvaluateDetailProduct,
  );
};
