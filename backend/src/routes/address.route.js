import addressController from "../controller/addresses.controller.js";

export default (router) => {
  router.get("/api/v1/addresses", addressController.getAllAddress);
};
