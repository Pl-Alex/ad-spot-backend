import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import { defaultCategories } from "./categories.js";

dotenv.config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Category.deleteMany({});
    await Category.insertMany(defaultCategories);
    console.log("Categories seeded");
    process.exit();
  } catch (err) {
    console.error("Failed to seed categories", err);
    process.exit(1);
  }
};

seedCategories();
