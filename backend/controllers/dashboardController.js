import { Customer, MilkEntry, Ledger } from "../models/index.js";
import { Op } from "sequelize";

export const getDashboard = async (req, res) => {
  try {

    const userId = req.user.id;

    const today = new Date().toISOString().split("T")[0];

    // Total Customers
    const totalCustomers = await Customer.count({
      where: {
        userId,
        status: "Active",
      },
    });

    // Today's Milk
    const todayMilk = await MilkEntry.sum("quantity", {
      where: {
        userId,
        entryDate: today,
      },
    });

    // Today's Payments
    const todayPayments = await Ledger.sum("debit", {
      where: {
        userId,
        type: "Payment",
        transactionDate: today,
      },
    });

    // Outstanding Balance
    const outstanding = await Customer.sum("currentBalance", {
      where: {
        userId,
        status: "Active",
      },
    });

    // Recent Transactions
    const recentTransactions = await Ledger.findAll({
      where: {
        userId,
      },
      limit: 10,
      order: [
        ["transactionDate", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    res.json({
      success: true,

      dashboard: {
        totalCustomers,

        todayMilk: todayMilk || 0,

        todayPayments: todayPayments || 0,

        outstanding: outstanding || 0,

        recentTransactions,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};