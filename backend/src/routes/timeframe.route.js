import timeframeController from "../controller/timeframe.controller.js";

export default (router) => {
  router.post("/api/v1/timeframes", timeframeController.create);

  router.get("/api/v1/timeframes", timeframeController.getAllTimeframe);

  router.patch("/api/v1/timeframes/:id", timeframeController.updateTimeframe);

  router.patch(
    "/api/v1/timeframes/:id/toggle",
    timeframeController.toggleTimeframe,
  );
};
