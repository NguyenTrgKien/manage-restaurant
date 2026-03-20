import crypto from "crypto";
import dotenv from "dotenv";
import axios from "axios";
import updateOrderStatus from "./updateOrder.service.js";

dotenv.config();

const paymentService = {
  handleCreatePaymentMomo: async (amount, orderId) => {
    const partnerCode = "MOMO";
    const accessKey = process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85";
    const secretkey =
      process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const orderInfo = "pay with MoMo";
    const requestId = `${orderId}_${Date.now()}`;
    const redirectUrl = "https://manage-sell-client.vercel.app/"; // Momo chuyển hướng về trình duyệt để biết thành công hay thất bại
    const ipnUrl =
      "https://quan-ly-ban-quan-ao-server.onrender.com/api/v1/payments/payment-callback"; // đường dẫn mà momo sẽ trả về (instant payment notification)
    const requestType = "payWithMethod";
    const extraData = "";

    const rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;

    const signature = crypto
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: "en",
    });

    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.payUrl;
  },

  handlePaymentCallback: async (req, res) => {
    try {
      const { orderId, resultCode } = req.body;

      if (resultCode !== 0) {
        await updateOrderStatus(orderId, "FAILED");

        return res.status(400).json({
          message: "Payment failed",
        });
      }

      await updateOrderStatus(orderId, "PAID");

      return res.status(200).json({
        message: "Thanh toán thành công",
      });
    } catch (error) {
      console.log("Callback Error:", error);

      return res.status(500).json({
        message: "Server Error",
      });
    }
  },

  handleTransactionStatus: async (req, res) => {
    try {
      const { orderId } = req.body;

      const accessKey = process.env.MOMO_ACCESS_KEY;
      const secretKey = process.env.MOMO_SECRET_KEY;
      const partnerCode = process.env.PARTNERCODE;

      const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = {
        partnerCode,
        requestId: orderId,
        orderId,
        signature,
        lang: "vi",
      };

      const result = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/query",
        requestBody,
      );

      return res.status(200).json(result.data);
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
};

export default paymentService;
