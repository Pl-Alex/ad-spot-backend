import mongoose from "mongoose";
import dotenv from "dotenv";
import Ad from "../models/Ad.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import { sampleAds } from "./ads.js";
import {
  sampleImageUrls,
  ensureUploadsDir,
  generateUniqueFilename,
  downloadImage,
} from "./sampleImages.js";

dotenv.config();

const downloadImages = async () => {
  const uploadsDir = ensureUploadsDir();
  const images = {};

  for (const [category, urls] of Object.entries(sampleImageUrls)) {
    images[category] = [];

    for (const url of urls) {
      const filename = generateUniqueFilename();
      const saved = await downloadImage(url, filename, uploadsDir);
      if (saved) {
        images[category].push(saved);
      }
    }
  }

  return images;
};

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

    const images = await downloadImages();

    await Ad.deleteMany({});
    await Ad.insertMany(sampleAds(user._id, categoryMap, images));

    console.log("Ads with images seeded successfully");
    process.exit();
  } catch (err) {
    console.error("Error seeding:", err.message);
    process.exit(1);
  }
};

seedAds();
