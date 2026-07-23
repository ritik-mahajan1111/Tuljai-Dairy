import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  addPayment,
  getPaymentHistory,
} from "../controllers/paymentController.js";

const router = express.Router();

// Add Payment
router.post("/", authMiddleware, addPayment);

// Payment History
router.get(
  "/customer/:customerId",
  authMiddleware,
  getPaymentHistory
);

export default router;