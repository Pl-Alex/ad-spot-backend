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
  body("title", "Title is required and must be between 3 and 100 characters")
    .isString()
    .isLength({ min: 3, max: 100 })
    .trim(),
  body(
    "description",
    "Description is required and must be between 10 and 2000 characters"
  )
    .isString()
    .isLength({ min: 10, max: 2000 })
    .trim(),
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
    .trim(),
  body("category", "Category is required and must be a valid ID").custom(
    (value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid category ID format");
      }
      return true;
    }
  ),
  body("photos", "Photos must be an array of valid URLs")
    .optional()
    .isArray({ max: 10 })
    .custom((photos) => {
      if (photos && photos.length > 0) {
        for (const photo of photos) {
          if (typeof photo !== "string" || photo.length > 500) {
            throw new Error(
              "Each photo URL must be a string with max 500 characters"
            );
          }
          try {
            new URL(photo);
          } catch {
            throw new Error("Invalid photo URL format");
          }
        }
      }
      return true;
    }),
];
