import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getCustomerLedger } from "../controllers/ledgerController.js";

const router = express.Router();

router.get("/customer/:customerId", authMiddleware, getCustomerLedger);

export default router;