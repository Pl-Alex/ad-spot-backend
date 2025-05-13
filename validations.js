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
  body("password", "Password must be at least 5 characters").isLength({
    min: 5,
  }),
];

export const adCreateValidation = [
  body("title", "Title is required and must be at least 3 characters")
    .isString()
    .isLength({ min: 3 }),
  body(
    "description",
    "Description is required and must be at least 10 characters"
  )
    .isString()
    .isLength({ min: 10 }),
  body("price", "Price must be a number greater than 0").isFloat({ min: 1 }),
  body("location", "Location is required").isString().notEmpty(),
  body("category", "Category is required").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid category ID");
    }
    return true;
  }),
  body("photos", "Photos must be an array of URLs").optional().isArray(),
];
