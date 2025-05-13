import CategoryModel from "../models/Category.js";

export const getAll = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch categories" });
  }
};
