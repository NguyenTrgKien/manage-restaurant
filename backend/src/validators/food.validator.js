import { body, param, validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errCode: 1,
      message: "Dữ liệu không hợp lệ!",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

export const validateCreateFood = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên món không được để trống")
    .isLength({ max: 100 })
    .withMessage("Tên món không được vượt quá 100 ký tự"),

  body("price")
    .notEmpty()
    .withMessage("Giá không được để trống")
    .isFloat({ min: 1 })
    .withMessage("Giá phải là số và lớn hơn 0"),

  body("categoryId")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("categoryId không hợp lệ"),

  body("description")
    .optional({ nullable: true })
    .isLength({ max: 500 })
    .withMessage("Mô tả không được vượt quá 500 ký tự"),

  validate,
];

export const validateEditFood = [
  body("name")
    .trim()
    .optional()
    .isLength({ max: 100 })
    .withMessage("Tên món không được vượt quá 100 ký tự"),

  body("price")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Giá phải là số và lớn hơn 0"),

  body("categoryId")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("categoryId không hợp lệ"),

  body("description")
    .optional({ nullable: true })
    .isLength({ max: 500 })
    .withMessage("Mô tả không được vượt quá 500 ký tự"),

  validate,
];
