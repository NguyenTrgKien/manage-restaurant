import { body, validationResult } from "express-validator";

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

const STATUS = ["WORKING", "ON_LEAVE", "RESIGNED"];
const POSITION = ["MANAGER", "WAITER", "CHEF", "CASHIER", "SECURITY"];

export const validateCreateStaff = [
  body("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),

  body("password")
    .notEmpty()
    .withMessage("Password không được để trống")
    .isLength({ min: 6 })
    .withMessage("Password phải ít nhất 6 ký tự"),

  body("position")
    .notEmpty()
    .withMessage("position không được để trống")
    .isIn(POSITION)
    .withMessage("position không hợp lệ!"),

  body("fullName")
    .notEmpty()
    .withMessage("fullName không được để trống")
    .isLength({ min: 2, max: 100 })
    .withMessage("fullName từ 2-100 ký tự"),

  body("status")
    .notEmpty()
    .withMessage("status không được để trống")
    .isIn(STATUS)
    .withMessage("Status không hợp lệ!"),
  body("phoneNumber")
    .notEmpty()
    .withMessage("phoneNumber không được để trống")
    .matches(/^[0-9]{9,11}$/)
    .withMessage("Số điện thoại không hợp lệ"),

  body("salary")
    .notEmpty()
    .withMessage("salary không được để trống")
    .isFloat({ min: 0 })
    .withMessage("salary phải là số >= 0"),

  body("gender")
    .notEmpty()
    .withMessage("gender không được để trống")
    .isIn(["male", "female", "other"])
    .withMessage("gender không hợp lệ"),

  body("startDate")
    .notEmpty()
    .withMessage("startDate không được để trống")
    .isISO8601()
    .withMessage("startDate phải đúng định dạng YYYY-MM-DD"),

  handleValidationErrors,
];

export const validateUpdateStaff = [
  body("email").optional().isEmail().withMessage("Email không hợp lệ"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password phải ít nhất 6 ký tự"),

  body("position")
    .optional()
    .isIn(POSITION)
    .withMessage("position không hợp lệ!"),

  body("fullName")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("fullName từ 2-100 ký tự"),

  body("status").optional().isIn(STATUS).withMessage("Status không hợp lệ!"),

  body("phoneNumber")
    .optional()
    .matches(/^[0-9]{9,11}$/)
    .withMessage("Số điện thoại không hợp lệ"),

  body("salary")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("salary phải là số >= 0"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("gender không hợp lệ"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate phải đúng định dạng YYYY-MM-DD"),

  handleValidationErrors,
];
