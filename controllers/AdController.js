import AdModel from "../models/Ad.js";

export const getAll = async (req, res) => {
  try {
    const ads = await AdModel.find()
      .populate("user_id")
      .populate("category")
      .exec();
    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve ads" });
  }
};

export const getOne = async (req, res) => {
  try {
    const adId = req.params.id;

    const ad = await AdModel.findByIdAndUpdate(adId)
      .populate("user_id")
      .populate("category");

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve ad" });
  }
};

export const remove = async (req, res) => {
  try {
    const adId = req.params.id;

    const deletedAd = await AdModel.findByIdAndDelete(adId);

    if (!deletedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete ad" });
  }
};

export const create = async (req, res) => {
  try {
    const ad = new AdModel({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      photos: req.body.photos || [],
      category: req.body.category,
      user_id: req.userId,
    });

    const savedAd = await ad.save();
    res.status(201).json(savedAd);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create ad" });
  }
};

export const update = async (req, res) => {
  try {
    const adId = req.params.id;

    const updatedAd = await AdModel.findByIdAndUpdate(
      adId,
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
        photos: req.body.photos || [],
        category: req.body.category,
        user_id: req.userId,
      },
      { new: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json(updatedAd);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update ad" });
  }
};
