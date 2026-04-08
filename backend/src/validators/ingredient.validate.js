import { body } from "express-validator";
import { validate } from "./food.validator.js";

export const createIngredientValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên nguyên liệu không được để trống")
    .isLength({ max: 100 })
    .withMessage("Tên nguyên liệu không được vượt quá 100 ký tự"),

  body("unit")
    .notEmpty()
    .withMessage("Đơn vị của nguyên liệu không được để trống")
    .isIn(["KG", "G", "L", "ML", "UNIT"])
    .withMessage("Đơn vị không hợp lệ"),

  body("description")
    .optional({ nullable: true })
    .isLength({ max: 500 })
    .withMessage("Mô tả không được vượt quá 500 ký tự"),

  body("categoryId")
    .notEmpty()
    .withMessage("Vui lòng chọn danh mục!")
    .isInt()
    .withMessage("Danh mục phải là số!"),

  body("minStock")
    .notEmpty()
    .withMessage("Mức tối thiểu không thể thiếu!")
    .isInt()
    .withMessage("Mức tối thiểu phải là số!"),

  validate,
];
