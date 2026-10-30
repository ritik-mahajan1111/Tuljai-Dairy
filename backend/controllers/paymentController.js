import { Customer, Ledger } from "../models/index.js";
import { recalculateCustomerBalance } from "../utils/ledgerHelper.js";
import { sendCustomerSMS } from "../services/smsService.js";

// ======================================================
// ADD PAYMENT
// ======================================================
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
        status: "Active",
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer Not Found",
      });
    }

    const payment = await Ledger.create({
      transactionDate: paymentDate,
      type: "Payment",
      description: description || "Payment Received",
      paymentMode: paymentMode || "Cash",
      credit: 0,
      debit: Number(amount),
      balance: 0,
      customerId: customer.id,
      userId: req.user.id,
    });

    await recalculateCustomerBalance(customer.id);

    await customer.reload();

    // ================================================
    // SEND PAYMENT SMS
    // ================================================
    try {
      await sendCustomerSMS({
        mobile: customer.mobile,

        variables: {
          customer_name: customer.fullName,
          amount: Number(amount).toFixed(2),
          payment_mode: paymentMode || "Cash",
          date: paymentDate,
          balance: Number(
            customer.currentBalance || 0
          ).toFixed(2),
        },
      });
    } catch (smsError) {
      console.error(
        "Payment SMS Error:",
        smsError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Payment Entry Saved Successfully",
      payment,
      smsSent: Boolean(
        process.env.MSG91_AUTH_KEY &&
        process.env.MSG91_FLOW_ID &&
        process.env.MSG91_SENDER_ID
      ),
    });

  } catch (error) {
    console.error("Add Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// GET CUSTOMER PAYMENT HISTORY
// ======================================================
export const getPaymentHistory = async (req, res) => {
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

    const payments = await Ledger.findAll({
      where: {
        customerId,
        userId: req.user.id,
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
    console.error(
      "Payment History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// GET SINGLE PAYMENT
// ======================================================
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Ledger.findOne({
      where: {
        id,
        type: "Payment",
        userId: req.user.id,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// UPDATE PAYMENT
// ======================================================
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      paymentDate,
      amount,
      paymentMode,
      description,
    } = req.body;

    const payment = await Ledger.findOne({
      where: {
        id,
        type: "Payment",
        userId: req.user.id,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment Not Found",
      });
    }

    const customer = await Customer.findOne({
      where: {
        id: payment.customerId,
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

    await payment.update({
      transactionDate: paymentDate,
      debit: Number(amount),
      paymentMode: paymentMode || "Cash",
      description:
        description || "Payment Received",
    });

    await recalculateCustomerBalance(
      customer.id
    );

    return res.status(200).json({
      success: true,
      message: "Payment Updated Successfully",
      payment,
    });

  } catch (error) {
    console.error(
      "Update Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// DELETE PAYMENT
// ======================================================
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Ledger.findOne({
      where: {
        id,
        type: "Payment",
        userId: req.user.id,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment Not Found",
      });
    }

    const customer = await Customer.findOne({
      where: {
        id: payment.customerId,
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

    await payment.destroy();

    await recalculateCustomerBalance(
      customer.id
    );

    return res.status(200).json({
      success: true,
      message: "Payment Deleted Successfully",
    });

  } catch (error) {
    console.error(
      "Delete Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};