import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import {
  registerValidation,
  loginValidation,
  adCreateValidation,
} from "./validations.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { upload } from "./utils/upload.js";

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

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100000,
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
  message: {
    message: "Too many uploads, please try again later.",
  },
});

app.use(limiter);

app.use(express.json({ limit: "10mb" }));

app.use(cors());

app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  authLimiter,
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  authLimiter,
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post(
  "/upload/photos",
  uploadLimiter,
  checkAuth,
  upload.array("photos", 5),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const photoUrls = req.files.map(
        (file) => `/uploads/ads/${file.filename}`
      );
      res.json({ photos: photoUrls });
    } catch (error) {
      res.status(500).json({ message: "Photo upload failed" });
    }
  }
);

app.get("/categories", CategoryController.getAll);

app.get("/ads/user/my", checkAuth, AdController.getUserAds);
app.get("/ads", AdController.getAll);
app.get("/ads/:id", AdController.getOne);
app.post(
  "/ads",
  checkAuth,
  adCreateValidation,
  handleValidationErrors,
  AdController.create
);
app.patch("/ads/:id/toggle", checkAuth, AdController.toggleStatus);
app.patch(
  "/ads/:id",
  checkAuth,
  adCreateValidation,
  handleValidationErrors,
  AdController.update
);
app.delete("/ads/:id", checkAuth, AdController.remove);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK.");
});
