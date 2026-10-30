import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getCustomerStatement,
} from "../controllers/statementController.js";

const router = express.Router();

router.get(
  "/customer/:customerId",
  authMiddleware,
  getCustomerStatement
);

export default router;