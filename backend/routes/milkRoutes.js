import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  addMilkEntry,
  getMilkHistory,
} from "../controllers/milkController.js";

const router = express.Router();

router.post("/", authMiddleware, addMilkEntry);

router.get("/customer/:customerId", authMiddleware, getMilkHistory);

export default router;