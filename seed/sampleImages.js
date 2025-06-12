import fs from "fs";
import path from "path";

export const sampleImageUrls = {
  electronics: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&h=600&fit=crop",
  ],
  vehicles: [
    "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop",
  ],
  realEstate: [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
  ],
  homeGarden: [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1558618047-3c8c76f5d14d?w=800&h=600&fit=crop",
  ],
  sports: [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop",
  ],
};

export const ensureUploadsDir = () => {
  const uploadsDir = path.join(process.cwd(), "uploads", "ads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

export const generateUniqueFilename = () => {
  return Date.now() + "-" + Math.round(Math.random() * 1000000000) + ".jpg";
};

export const downloadImage = async (url, filename, uploadsDir) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const buffer = await response.arrayBuffer();
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, Buffer.from(buffer));
    return filename;
  } catch (error) {
    return null;
  }
};
