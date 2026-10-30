import {
  MilkEntry,
  Customer,
  Ledger,
} from "../models/index.js";

import { recalculateCustomerBalance } from "../utils/ledgerHelper.js";

import { sendCustomerSMS } from "../services/smsService.js";

// ======================================================
// ADD MILK ENTRY
// ======================================================
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

    

    // Final Rate
    const finalRate =
      rate && Number(rate) > 0
        ? Number(rate)
        : Number(customer.defaultRate);

    // Amount
    const amount =
      Number(quantity) * finalRate;

    // Create Milk Entry
    const milkEntry = await MilkEntry.create({
      customerId,
      userId: req.user.id,
      entryDate,
      session,
      quantity,
      rate: finalRate,
      amount,
      remarks: remarks || "",
    });

    // Create Ledger Entry
    await Ledger.create({
      transactionDate: entryDate,
      type: "Milk",
      description: `${session} Milk Entry`,
      paymentMode: "Cash",
      credit: amount,
      debit: 0,
      balance: 0,
      customerId: customer.id,
      userId: req.user.id,
    });

    // Recalculate Balance
    await recalculateCustomerBalance(customer.id);

    // Reload customer after balance update
    await customer.reload();

    // ==================================================
    // SEND SMS
    // ==================================================
    try {
      await sendCustomerSMS({
        mobile: customer.mobile,

        variables: {
          customer_name: customer.fullName,
          quantity: Number(quantity).toFixed(2),
          rate: Number(finalRate).toFixed(2),
          amount: Number(amount).toFixed(2),
          session: session,
          date: entryDate,
          balance: Number(
            customer.currentBalance || 0
          ).toFixed(2),
        },
      });
    } catch (smsError) {
      // SMS failure should NOT fail milk entry
      console.error(
        "Milk SMS Error:",
        smsError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Milk Entry Added Successfully",
      milkEntry,
      smsSent: Boolean(
        process.env.MSG91_AUTH_KEY &&
        process.env.MSG91_FLOW_ID &&
        process.env.MSG91_SENDER_ID
      ),
    });

  } catch (error) {
    console.error("Add Milk Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// GET CUSTOMER MILK HISTORY
// ======================================================
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
        userId: req.user.id,
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
    console.error("Milk History Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// GET MILK BY ID
// ======================================================
export const getMilkById = async (req, res) => {
  try {
    const { id } = req.params;

    const milkEntry = await MilkEntry.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!milkEntry) {
      return res.status(404).json({
        success: false,
        message: "Milk Entry Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      milkEntry,
    });

  } catch (error) {
    console.error("Get Milk Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// UPDATE MILK ENTRY
// ======================================================
export const updateMilkEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      entryDate,
      session,
      quantity,
      rate,
      remarks,
    } = req.body;

    const milkEntry = await MilkEntry.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!milkEntry) {
      return res.status(404).json({
        success: false,
        message: "Milk Entry Not Found",
      });
    }

    // Save old ledger values before updating
    const oldEntryDate = milkEntry.entryDate;
    const oldSession = milkEntry.session;

    const amount =
      Number(quantity) * Number(rate);

    // Update Milk
    await milkEntry.update({
      entryDate,
      session,
      quantity,
      rate,
      amount,
      remarks: remarks || "",
    });

    // Find corresponding ledger
    const ledger = await Ledger.findOne({
      where: {
        customerId: milkEntry.customerId,
        userId: req.user.id,
        type: "Milk",
        description: `${oldSession} Milk Entry`,
        transactionDate: oldEntryDate,
      },
    });

    if (ledger) {
      await ledger.update({
        transactionDate: entryDate,
        description: `${session} Milk Entry`,
        credit: amount,
      });
    }

    // Recalculate
    await recalculateCustomerBalance(
      milkEntry.customerId
    );

    return res.status(200).json({
      success: true,
      message: "Milk Entry Updated Successfully",
      milkEntry,
    });

  } catch (error) {
    console.error("Update Milk Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// DELETE MILK ENTRY
// ======================================================
export const deleteMilkEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const milkEntry = await MilkEntry.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!milkEntry) {
      return res.status(404).json({
        success: false,
        message: "Milk Entry Not Found",
      });
    }

    // Delete Ledger
    await Ledger.destroy({
      where: {
        customerId: milkEntry.customerId,
        userId: req.user.id,
        type: "Milk",
        description: `${milkEntry.session} Milk Entry`,
        transactionDate: milkEntry.entryDate,
      },
    });

    // Delete Milk Entry
    await milkEntry.destroy();

    // Recalculate
    await recalculateCustomerBalance(
      milkEntry.customerId
    );

    return res.status(200).json({
      success: true,
      message: "Milk Entry Deleted Successfully",
    });

  } catch (error) {
    console.error("Delete Milk Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};