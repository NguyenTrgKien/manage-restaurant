import tableController from "../controller/table.controller.js";

export default (router) => {
  router.get("/api/v1/tables", tableController.getAllTable);

  router.get("/api/v1/tables/:id", tableController.getTableById);

  router.post("/api/v1/tables", tableController.createTable);

  router.patch("/api/v1/tables/:id", tableController.updateTable);

  router.patch("/api/v1/tables/:id/toggle", tableController.toggleMaintenance);
};
