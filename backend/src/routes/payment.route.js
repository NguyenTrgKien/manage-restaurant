import paymentService from "../services/payment.service.js";

export default (router) => {
  router.post("/create_payment_url", paymentService.handleCreatePaymentMomo);

  router.post(
    "/api/v1/payment-momo-url",
    paymentService.handleCreatePaymentMomo,
  );

  router.post("/payment-callback", paymentService.handlePaymentCallback);

  router.post(
    "/api/v1/transaction-status",
    paymentService.handleTransactionStatus,
  );
};
