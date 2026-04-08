import { body, param, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errCode: 1,
      message: "Dữ liệu không hợp lệ",
      errors: errors.array(),
    });
  }
  next();
};

export const validateCreateOrderDish = [
  body("customerId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("userId phải là số nguyên dương"),

  body("fullName")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("fullName không được quá 100 ký tự"),

  body("phoneNumber")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 10 })
    .withMessage("phoneNumber không được quá 10 kí số!"),

  body("paymentMethod")
    .isIn(["cash", "momo"])
    .withMessage("paymentMethod không hợp lệ"),

  body("totalAmount")
    .isFloat({ gt: 0 })
    .withMessage("totalAmount phải lớn hơn 0!"),

  body("note").optional(),

  body("orderItems")
    .isArray({ min: 1 })
    .withMessage("orderItems phải là mảng và không được rỗng"),

  body("orderItems.*.foodId")
    .isInt({ min: 1 })
    .withMessage("foodId phải là số nguyên dương"),

  body("orderItems.*.quantity")
    .isInt({ min: 1 })
    .withMessage("quantity phải là số nguyên dương"),

  body().custom((_, { req }) => {
    if (!req.body.customerId && !req.body.fullName) {
      throw new Error("Phải cung cấp customerId hoặc fullName");
    }
    return true;
  }),
];

export const validateCreateOrderTable = [
  body("customerId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("customerId phải là số nguyên dương"),

  body("tableId")
    .isInt({ min: 1 })
    .withMessage("tableId phải là số nguyên dương"),

  body("fullName")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("fullName không được quá 100 ký tự"),

  body("phoneNumber")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 10 })
    .withMessage("phoneNumber không được quá 10 kí số!"),

  body("numberGuests")
    .isInt({ min: 0 })
    .withMessage("Số khách phải lớn hơn 0!"),

  body("note").optional(),

  body("paymentMethod")
    .optional()
    .isIn(["cash", "momo"])
    .withMessage("paymentMethod không hợp lệ"),

  body("orderDate")
    .isISO8601()
    .toDate()
    .custom((value) => {
      const now = new Date();
      const maxDate = new Date();
      maxDate.setDate(now.getDate() + 10);

      if (value > maxDate) {
        throw new Error("Không thể đặt bàn quá 10 ngày!");
      }
      return true;
    })
    .withMessage("orderDate không hợp lệ!"),

  body("orderItems")
    .optional()
    .isArray({ min: 1 })
    .withMessage("items phải là mảng và không được rỗng"),

  body("orderItems.*.foodId")
    .isInt({ min: 1 })
    .withMessage("foodId phải là số nguyên dương"),

  body("orderItems.*.quantity")
    .isInt({ min: 1 })
    .withMessage("quantity phải là số nguyên dương"),

  body().custom((_, { req }) => {
    if (!req.body.customerId && !req.body.fullName) {
      throw new Error("Phải cung cấp customerId hoặc fullName");
    }
    return true;
  }),

  handleValidationErrors,
];

export const validateOrderTable = [
  body("userId")
    .isInt({ min: 1 })
    .withMessage("userId phải là số nguyên dương"),

  body("tableId")
    .isInt({ min: 1 })
    .withMessage("tableId phải là số nguyên dương"),

  body("orderDate")
    .isISO8601()
    .withMessage("orderDate phải có định dạng YYYY-MM-DD"),

  body("timeFrameId")
    .isInt({ min: 1 })
    .withMessage("timeFrameId phải là số nguyên dương"),

  body("numberGuests")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("numberGuests phải từ 1 đến 20"),

  body("note")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("note không được quá 500 ký tự"),

  handleValidationErrors,
];

export const validatePaymentAtRestaurant = [
  body("orderId")
    .isInt({ min: 1 })
    .withMessage("orderId phải là số nguyên dương"),

  body("paymentAmount")
    .isFloat({ min: 0.001 })
    .withMessage("paymentAmount phải lớn hơn 0"),

  handleValidationErrors,
];

export const validatePaymentTableAtRestaurant = [
  body("orderTableId")
    .isInt({ min: 1 })
    .withMessage("orderTableId phải là số nguyên dương"),

  body("paymentAmount")
    .isFloat({ min: 0.001 })
    .withMessage("paymentAmount phải lớn hơn 0"),

  handleValidationErrors,
];

export const validateCancelOrder = [
  param("orderId")
    .isInt({ min: 1 })
    .withMessage("orderId phải là số nguyên dương"),

  body("reason")
    .optional()
    .isString()
    .isLength({ min: 1, max: 500 })
    .withMessage("reason phải từ 1 đến 500 ký tự"),

  handleValidationErrors,
];

export const validateCancelOrderTable = [
  param("orderTableId")
    .isInt({ min: 1 })
    .withMessage("orderTableId phải là số nguyên dương"),

  body("reason")
    .optional()
    .isString()
    .isLength({ min: 1, max: 500 })
    .withMessage("reason phải từ 1 đến 500 ký tự"),

  handleValidationErrors,
];

export const validateCheckOrderTableDish = [
  body("tableId")
    .isInt({ min: 1 })
    .withMessage("tableId phải là số nguyên dương"),

  body("orderDate")
    .isISO8601()
    .withMessage("orderDate phải có định dạng YYYY-MM-DD"),

  body("timeFrameId")
    .isInt({ min: 1 })
    .withMessage("timeFrameId phải là số nguyên dương"),

  body("items").optional().isArray().withMessage("items phải là mảng"),

  body("items.*.foodId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("foodId phải là số nguyên dương"),

  body("items.*.quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("quantity phải là số nguyên dương"),

  handleValidationErrors,
];

export const validateGetOrderTableDate = [
  param("orderDate")
    .isISO8601()
    .withMessage("orderDate phải có định dạng YYYY-MM-DD"),

  handleValidationErrors,
];
