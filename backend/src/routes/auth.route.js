import authController from "../controller/auth.controller.js";
import verifyToken from "../middlewares/authMiddleware.js";

export default (router) => {
  router.post("/api/v1/login", authController.handleLogin);

  router.get("/api/v1/auth/me", verifyToken, authController.getMe);

  router.post("/api/v1/register", authController.handleRegisterUser);

  router.post("/api/v1/logout", verifyToken, authController.handleLogOut);
};
