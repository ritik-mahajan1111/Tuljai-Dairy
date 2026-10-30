import { Customer, Ledger } from "../models/index.js";

// Customer Statement
export const getCustomerStatement = async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findOne({
      where: {
        id: customerId,
        userId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer Not Found",
      });
    }

    const transactions = await Ledger.findAll({
      where: {
        customerId,
      },
      order: [
        ["transactionDate", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    return res.status(200).json({
      success: true,
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        mobile: customer.mobile,
        village: customer.village,
      },
      openingBalance: customer.openingBalance,
      currentBalance: customer.currentBalance,
      totalTransactions: transactions.length,
      transactions,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};