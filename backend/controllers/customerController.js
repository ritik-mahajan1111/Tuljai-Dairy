import {
  Customer,
  MilkEntry,
  Ledger,
} from "../models/index.js";

import {
  transliterateCustomerName,
} from "../utils/hindiTransliteration.js";


// ==========================================
// Add Customer
// ==========================================
export const addCustomer = async (req, res) => {
  try {

    const {
      fullName,
      mobile,
      address,
      village,
      milkType,
      defaultRate,
      shift,
      notes,
      openingBalance,
    } = req.body;


    if (!fullName || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Full Name and Mobile are required",
      });
    }


    const existingCustomer =
      await Customer.findOne({
        where: {
          mobile,
          userId: req.user.id,
        },
      });


    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer already exists",
      });
    }


    const totalCustomers =
      await Customer.count({
        where: {
          userId: req.user.id,
        },
      });


    const opening =
      Number(openingBalance) || 0;


    // ==========================================
    // Automatically create Hindi name
    // ==========================================

    const hindiName =
      transliterateCustomerName(fullName);


    const customer =
      await Customer.create({

        customerCode:
          `TD${String(totalCustomers + 1).padStart(4, "0")}`,

        fullName,

        hindiName,

        mobile,

        address: address || "",

        village: village || "",

        milkType: milkType || "Cow",

        defaultRate:
          Number(defaultRate) || 0,

        shift: shift || "Both",

        notes: notes || "",

        openingBalance: opening,

        currentBalance: opening,

        userId: req.user.id,

      });


    // ==========================================
    // Opening Ledger
    // ==========================================

    if (opening !== 0) {

      await Ledger.create({

        transactionDate: new Date(),

        type: "Opening",

        description: "Opening Balance",

        paymentMode: "Opening",

        credit:
          opening > 0
            ? opening
            : 0,

        debit:
          opening < 0
            ? Math.abs(opening)
            : 0,

        balance: opening,

        customerId: customer.id,

        userId: req.user.id,

      });

    }


    return res.status(201).json({

      success: true,

      message:
        "Customer Added Successfully",

      customer,

    });

  } catch (error) {

    console.log(
      "Add Customer Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};


// ==========================================
// Get All Customers
// ==========================================
export const getCustomers = async (req, res) => {

  try {

    const customers =
      await Customer.findAll({

        where: {
          userId: req.user.id,
          status: "Active",
        },

        order: [
          ["createdAt", "DESC"],
        ],

      });


    return res.status(200).json({

      success: true,

      total: customers.length,

      customers,

    });

  } catch (error) {

    console.log(
      "Get Customers Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


// ==========================================
// Get Customer By ID
// ==========================================
export const getCustomerById =
  async (req, res) => {

    try {

      const { id } = req.params;


      const customer =
        await Customer.findOne({

          where: {
            id,
            userId: req.user.id,
          },

        });


      if (!customer) {

        return res.status(404).json({

          success: false,

          message:
            "Customer Not Found",

        });

      }


      return res.status(200).json({

        success: true,

        customer,

      });

    } catch (error) {

      console.log(
        "Get Customer Error:",
        error
      );

      return res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };


// ==========================================
// Get Complete Customer Details
// ==========================================
export const getCustomerDetails =
  async (req, res) => {

    try {

      const { id } = req.params;


      const customer =
        await Customer.findOne({

          where: {
            id,
            userId: req.user.id,
          },

        });


      if (!customer) {

        return res.status(404).json({

          success: false,

          message:
            "Customer Not Found",

        });

      }


      const milkHistory =
        await MilkEntry.findAll({

          where: {
            customerId: id,
            userId: req.user.id,
          },

          order: [
            ["entryDate", "DESC"],
            ["createdAt", "DESC"],
          ],

        });


      const paymentHistory =
        await Ledger.findAll({

          where: {
            customerId: id,
            userId: req.user.id,
            type: "Payment",
          },

          order: [
            ["transactionDate", "DESC"],
            ["createdAt", "DESC"],
          ],

        });


      const statement =
        await Ledger.findAll({

          where: {
            customerId: id,
            userId: req.user.id,
          },

          order: [
            ["transactionDate", "ASC"],
            ["createdAt", "ASC"],
          ],

        });


      const totalMilkAmount =
        milkHistory.reduce(
          (total, item) =>
            total +
            Number(item.amount || 0),
          0
        );


      const totalMilkQuantity =
        milkHistory.reduce(
          (total, item) =>
            total +
            Number(item.quantity || 0),
          0
        );


      const totalPayments =
        paymentHistory.reduce(
          (total, item) =>
            total +
            Number(item.debit || 0),
          0
        );


      const latestMilk =
        milkHistory.length > 0
          ? milkHistory[0]
          : null;


      const latestPayment =
        paymentHistory.length > 0
          ? paymentHistory[0]
          : null;


      return res.status(200).json({

        success: true,

        customer,

        summary: {

          openingBalance:
            Number(
              customer.openingBalance || 0
            ),

          currentBalance:
            Number(
              customer.currentBalance || 0
            ),

          totalMilkQuantity,

          totalMilkAmount,

          totalPayments,

          totalMilkEntries:
            milkHistory.length,

          totalPaymentEntries:
            paymentHistory.length,

          totalTransactions:
            statement.length,

        },

        latestMilk,

        latestPayment,

        milkHistory,

        paymentHistory,

        statement,

      });

    } catch (error) {

      console.log(
        "Customer Details Error:",
        error
      );

      return res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };


// ==========================================
// Update Customer
// ==========================================
export const updateCustomer =
  async (req, res) => {

    try {

      const { id } = req.params;


      const customer =
        await Customer.findOne({

          where: {
            id,
            userId: req.user.id,
          },

        });


      if (!customer) {

        return res.status(404).json({

          success: false,

          message:
            "Customer Not Found",

        });

      }


      const {
        fullName,
        mobile,
        address,
        village,
        milkType,
        defaultRate,
        shift,
        notes,
        profileImage,
        status,
      } = req.body;


      // ==========================================
      // Automatically update Hindi name
      // ==========================================

      const hindiName =
        transliterateCustomerName(fullName);


      await customer.update({

        fullName,

        hindiName,

        mobile,

        address,

        village,

        milkType,

        defaultRate,

        shift,

        notes,

        profileImage,

        status,

      });


      return res.status(200).json({

        success: true,

        message:
          "Customer Updated Successfully",

        customer,

      });

    } catch (error) {

      console.log(
        "Update Customer Error:",
        error
      );

      return res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };


// ==========================================
// Delete Customer
// ==========================================
export const deleteCustomer =
  async (req, res) => {

    try {

      const { id } = req.params;


      const customer =
        await Customer.findOne({

          where: {
            id,
            userId: req.user.id,
          },

        });


      if (!customer) {

        return res.status(404).json({

          success: false,

          message:
            "Customer Not Found",

        });

      }


      await customer.update({

        status: "Inactive",

      });


      return res.status(200).json({

        success: true,

        message:
          "Customer Deleted Successfully",

      });

    } catch (error) {

      console.log(
        "Delete Customer Error:",
        error
      );

      return res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };