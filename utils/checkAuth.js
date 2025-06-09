import "dotenv/config";
import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({
          message: "Token expired",
        });
      }

      req.userId = decoded.userId;
      next();
    } catch (e) {
      return res.status(403).json({
        message: "No Access",
      });
    }
  } else {
    return res.status(403).json({
      message: "No Access",
    });
  }
};
