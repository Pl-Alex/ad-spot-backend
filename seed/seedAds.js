import mongoose from "mongoose";
import dotenv from "dotenv";
import Ad from "../models/Ad.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import { sampleAds } from "./ads.js";

dotenv.config();

const seedAds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne();
    const allCategories = await Category.find();

    if (!user || allCategories.length === 0) {
      throw new Error("Missing users or categories. Seed them first.");
    }

    const categoryMap = {};
    allCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    await Ad.deleteMany({});
    await Ad.insertMany(sampleAds(user._id, categoryMap));

    console.log("Sample seeded.");
    process.exit();
  } catch (err) {
    console.error("Error seeding:", err.message);
    process.exit(1);
  }
};

seedAds();
