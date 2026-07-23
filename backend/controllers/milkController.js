import {
  MilkEntry,
  Customer,
  Ledger,
} from "../models/index.js";

// ===============================
// Add Milk Entry
// ===============================
export const addMilkEntry = async (req, res) => {
  try {
    const {
      customerId,
      entryDate,
      session,
      quantity,
      rate,
      remarks,
    } = req.body;

    // Validation
    if (!customerId || !entryDate || !session || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Customer Check
    const customer = await Customer.findOne({
      where: {
        id: customerId,
        userId: req.user.id,
        status: "Active",
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Duplicate Entry Check
    const existingEntry = await MilkEntry.findOne({
      where: {
        customerId,
        entryDate,
        session,
      },
    });

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: `${session} entry already exists for this date.`,
      });
    }

    // Default Rate
    const finalRate =
      rate && Number(rate) > 0
        ? Number(rate)
        : Number(customer.defaultRate);

    // Auto Amount
    const amount = Number(quantity) * finalRate;

    const milkEntry = await MilkEntry.create({
      customerId,
      userId: req.user.id,
      entryDate,
      session,
      quantity,
      rate: finalRate,
      amount,
      remarks,
    });

   // New Balance
const newBalance =
Number(customer.currentBalance) + amount;

// Update Customer Balance
await customer.update({
currentBalance: newBalance,
});

// Ledger Entry
await Ledger.create({
transactionDate: entryDate,
type: "Milk",
description: `${session} Milk Entry`,
credit: amount,
debit: 0,
balance: newBalance,
customerId: customer.id,
userId: req.user.id,
});

    return res.status(201).json({
      success: true,
      message: "Milk Entry Added Successfully",
      milkEntry,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Customer Milk History
// ===============================
export const getMilkHistory = async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findOne({
      where: {
        id: customerId,
        userId: req.user.id,
        status: "Active",
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer Not Found",
      });
    }

    const history = await MilkEntry.findAll({
      where: {
        customerId,
      },
      order: [
        ["entryDate", "DESC"],
        ["session", "ASC"],
      ],
    });

    return res.status(200).json({
      success: true,
      total: history.length,
      history,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};