import AdModel from "../models/Ad.js";

export const getAll = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      location,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { active: true };

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (location) filter.location = { $regex: location, $options: "i" };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const ads = await AdModel.find(filter)
      .populate("user_id")
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await AdModel.countDocuments(filter);

    res.json({
      ads,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve ads" });
  }
};

export const getOne = async (req, res) => {
  try {
    const adId = req.params.id;

    const ad = await AdModel.findById(adId)
      .populate("user_id")
      .populate("category");

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }
    if (!ad.active) {
      return res.status(404).json({ message: "Ad is no longer available" });
    }

    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve ad" });
  }
};

export const getUserAds = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const ads = await AdModel.find({ user_id: req.userId })
      .populate("user_id")
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await AdModel.countDocuments({ user_id: req.userId });

    res.json({
      ads,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve user ads" });
  }
};

export const remove = async (req, res) => {
  try {
    const adId = req.params.id;

    const ad = await AdModel.findById(adId);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    if (ad.user_id.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own ads" });
    }

    await AdModel.findByIdAndDelete(adId);
    res.json({ success: true, message: "Ad deleted successfully" });
  } catch (err) {
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

    const populatedAd = await AdModel.findById(savedAd._id)
      .populate("user_id")
      .populate("category");
    res.status(201).json(populatedAd);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Failed to create ad" });
  }
};

export const update = async (req, res) => {
  try {
    const adId = req.params.id;

    const existingAd = await AdModel.findById(adId);
    if (!existingAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    if (existingAd.user_id.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own ads" });
    }

    const updatedAd = await AdModel.findByIdAndUpdate(
      adId,
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
        photos: req.body.photos || [],
        category: req.body.category,
      },
      { new: true }
    )
      .populate("user_id")
      .populate("category");

    res.json(updatedAd);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Failed to update ad" });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const adId = req.params.id;

    const ad = await AdModel.findById(adId);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    if (ad.user_id.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You can only modify your own ads" });
    }

    ad.active = !ad.active;
    await ad.save();

    res.json({
      success: true,
      active: ad.active,
      message: `Ad ${ad.active ? "activated" : "deactivated"}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update ad status" });
  }
};
