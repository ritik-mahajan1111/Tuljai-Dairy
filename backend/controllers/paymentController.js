import { Customer, Ledger } from "../models/index.js";

// Add Payment Entry
export const addPayment = async (req, res) => {
  try {
    const {
      customerId,
      amount,
      paymentMode,
      description,
      paymentDate,
    } = req.body;

    if (!customerId || !amount || !paymentDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

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

    const newBalance =
      Number(customer.currentBalance) - Number(amount);

    await customer.update({
      currentBalance: newBalance,
    });

    const payment = await Ledger.create({
      transactionDate: paymentDate,
      type: "Payment",
      description: description || "Payment Received",
      paymentMode: paymentMode || "Cash",
      credit: 0,
      debit: amount,
      balance: newBalance,
      customerId: customer.id,
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Payment Entry Saved Successfully",
      payment,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get Customer Payment History
export const getPaymentHistory = async (req, res) => {
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

    const payments = await Ledger.findAll({
      where: {
        customerId,
        type: "Payment",
      },
      order: [
        ["transactionDate", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    return res.status(200).json({
      success: true,
      total: payments.length,
      payments,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};