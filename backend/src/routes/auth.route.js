import authController from "../controller/auth.controller.js";
import verifyToken from "../middlewares/authMiddleware.js";

export default (router) => {
  router.get("/api/v1/get-all-user", authController.getAllUser);

  router.post("/api/v1/login", authController.handleLogin);

  router.post(
    "/api/v1/auth-login-google",
    authController.handleAuthLoginGoogle,
  );

  router.get("/api/v1/auth/me", verifyToken, authController.getMe);

  router.post("/api/v1/user-register", authController.handleRegisterUser);

  router.post("/api/v1/logout", authController.handleLogOut);
};
