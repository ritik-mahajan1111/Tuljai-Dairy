import { Ledger, Customer } from "../models/index.js";

// Get Customer Ledger
export const getCustomerLedger = async (req, res) => {
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

    const ledger = await Ledger.findAll({
      where: {
        customerId,
      },
      order: [["transactionDate", "DESC"], ["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      customer: {
        id: customer.id,
        customerCode: customer.customerCode,
        fullName: customer.fullName,
        currentBalance: customer.currentBalance,
      },
      totalEntries: ledger.length,
      ledger,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};