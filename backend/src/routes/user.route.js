import userController from "../controller/user.controller.js";

export default (router) => {
  router.get("/api/v1/user", userController.getUserById);
};
