import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  addCustomer,
  getCustomers,
  getCustomerById,
  getCustomerDetails,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

// Add Customer
router.post(
  "/",
  authMiddleware,
  addCustomer
);

// Get All Customers
router.get(
  "/",
  authMiddleware,
  getCustomers
);

// Get Complete Customer Details
router.get(
  "/:id/details",
  authMiddleware,
  getCustomerDetails
);

// Get Customer By ID
router.get(
  "/:id",
  authMiddleware,
  getCustomerById
);

// Update Customer
router.put(
  "/:id",
  authMiddleware,
  updateCustomer
);

// Delete Customer
router.delete(
  "/:id",
  authMiddleware,
  deleteCustomer
);

export default router;