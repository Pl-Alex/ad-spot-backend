import { body } from "express-validator";
import mongoose from "mongoose";

export const registerValidation = [
  body("email", "Invalid email format").isEmail(),
  body("password", "Password must be at least 5 characters").isLength({
    min: 5,
  }),
  body("fullName", "Name must be at least 3 characters").isLength({ min: 3 }),
];

export const loginValidation = [
  body("email", "Invalid email format").isEmail(),
  body("password", "Password must be at least 5 characters")
    .isLength({
      min: 5,
    })
    .escape(),
];

export const adCreateValidation = [
  body("title", "Title is required and must be between 3 and 100 characters")
    .isString()
    .isLength({ min: 3, max: 100 })
    .trim()
    .escape(),
  body(
    "description",
    "Description is required and must be between 10 and 2000 characters"
  )
    .isString()
    .isLength({ min: 10, max: 2000 })
    .trim()
    .escape(),
  body(
    "price",
    "Price must be a number greater than 0 and less than 1,000,000"
  ).isFloat({ min: 0.01, max: 999999.99 }),
  body(
    "location",
    "Location is required and must be between 2 and 100 characters"
  )
    .isString()
    .isLength({ min: 2, max: 100 })
    .trim()
    .escape(),
  body("category", "Category is required and must be a valid ID").custom(
    (value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid category ID format");
      }
      return true;
    }
  ),
  body("photos", "Photos must be an array").optional().isArray({ max: 5 }),
];
