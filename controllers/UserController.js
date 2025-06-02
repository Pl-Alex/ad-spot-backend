import "dotenv/config";

import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import { createToken } from "../utils/createToken.js";

export const register = async (req, res) => {
  try {
    const { email, fullName, password, avatarUrl } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { fullName }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ message: "Email already registered" });
      }
      if (existingUser.fullName === fullName) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    const user = await new UserModel({
      email,
      fullName,
      avatarUrl: avatarUrl || "",
      passwordHash: hash,
    }).save();

    const token = createToken(user._id);
    const { passwordHash, ...userData } = user.toObject();

    res
      .status(201)
      .json({ ...userData, token, message: "User registered successfully" });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const message =
        field === "email"
          ? "Email already registered"
          : "Username already taken";
      return res.status(409).json({ message });
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }

    res.status(500).json({ message: "Unable to register user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isValidPass = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPass) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);
    const { passwordHash, ...userData } = user.toObject();

    res.json({
      ...userData,
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Unable to login",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { passwordHash, ...userData } = user.toObject();
    res.json(userData);
  } catch (err) {
    res.status(500).json({
      message: "No access",
    });
  }
};
