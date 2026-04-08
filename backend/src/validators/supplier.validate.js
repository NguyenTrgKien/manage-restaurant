import { body, validationResult } from "express-validator";

export const validateSupplierData = [
  body("name")
    .notEmpty()
    .withMessage("Tên nhà cung cấp không được để trống")
    .isLength({ max: 100 })
    .withMessage("Tên không được quá 100 ký tự"),
  body("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),
  body("phone")
    .notEmpty()
    .withMessage("Số điện thoại không được để trống")
    .isMobilePhone("vi-VN")
    .withMessage("Số điện thoại không hợp lệ"),
  body("address").notEmpty().withMessage("Địa chỉ không được để trống"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateSupplierDataUpdate = [
  body("name")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Tên không được quá 100 ký tự"),
  body("email").optional().isEmail().withMessage("Email không hợp lệ"),
  body("phone")
    .optional()
    .isMobilePhone("vi-VN")
    .withMessage("Số điện thoại không hợp lệ"),
  body("address").optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
