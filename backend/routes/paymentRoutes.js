import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  addPayment,
  getPaymentHistory,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", authMiddleware, addPayment);

router.get(
  "/customer/:customerId",
  authMiddleware,
  getPaymentHistory
);

router.get("/:id", authMiddleware, getPaymentById);

router.put("/:id", authMiddleware, updatePayment);

router.delete("/:id", authMiddleware, deletePayment);

export default router;