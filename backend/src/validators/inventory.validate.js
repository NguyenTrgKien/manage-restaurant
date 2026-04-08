import { body } from "express-validator";
import { validate } from "./food.validator.js";

export const importStockValidator = [
  body("supplierId")
    .notEmpty()
    .withMessage("Nhà cung cấp không được để trống")
    .isInt()
    .withMessage("Id nhà cung cấp phải là số!"),

  body("note").optional(),

  body("items").isArray({ min: 1 }).withMessage("Items không được rỗng"),

  body("items.*.ingredientId")
    .notEmpty()
    .withMessage("Vui lòng chọn nguyên liệu!")
    .isInt()
    .withMessage("Id nguyên liệu phải là số!"),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("Số lượng không thể thiếu!")
    .isInt()
    .withMessage("Số lượng phải là số!"),
  body("items.*.unitPrice")
    .notEmpty()
    .withMessage("Giá thành không thể thiếu!"),
  body("items.*.manufactureDate")
    .notEmpty()
    .withMessage("Ngày sản xuất không thể thiếu!")
    .isISO8601()
    .withMessage("Ngày sản xuất không hợp lệ"),

  body("items.*.expiryAt")
    .notEmpty()
    .withMessage("Ngày hết hạn không thể thiếu!")
    .isISO8601()
    .withMessage("Ngày hết hạn không hợp lệ"),
  validate,
];
