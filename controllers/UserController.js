import "dotenv/config";

import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import { createToken } from "../utils/createToken.js";

export const register = async (req, res) => {
  try {
    const { email, fullName, password, avatarUrl } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await new UserModel({
      email,
      fullName,
      avatarUrl: avatarUrl || "",
      passwordHash: hash,
    }).save();

    const token = createToken(user._id);
    const { passwordHash, ...userData } = user.toObject();

    res.status(201).json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Unable to register",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

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
    console.log(err);
    res.status(500).json({
      message: "No access",
    });
  }
};
