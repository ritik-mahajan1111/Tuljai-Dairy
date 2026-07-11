import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const authMiddleware = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid User",
      });
    }

    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });

  }
};

export default authMiddleware;