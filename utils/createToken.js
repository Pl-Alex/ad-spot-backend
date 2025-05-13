import "dotenv/config";

import jwt from "jsonwebtoken";

export const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
