import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  adCreateValidation,
} from "./validations.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";

import {
  UserController,
  AdController,
  CategoryController,
} from "./controllers/index.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB ok."))
  .catch((err) => console.log("DB connection error :: ", err));

const app = express();

app.use(express.json());
app.use(cors());

// Authentication;
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

// Categories
app.get("/categories", CategoryController.getAll);

// Ads
app.get("/ads", AdController.getAll);
app.get("/ads/:id", AdController.getOne);
app.post(
  "/ads",
  checkAuth,
  adCreateValidation,
  handleValidationErrors,
  AdController.create
);
app.patch(
  "/ads/:id",
  checkAuth,
  adCreateValidation,
  handleValidationErrors,
  AdController.update
);
app.delete("/ads/:id", checkAuth, AdController.remove);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK.");
});
