import { Customer, Ledger } from "../models/index.js";

export const recalculateCustomerBalance = async (customerId) => {
  // Customer
  const customer = await Customer.findByPk(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  // Opening Balance
  let runningBalance = Number(customer.openingBalance || 0);

  // All Ledger Entries
  const entries = await Ledger.findAll({
    where: {
      customerId,
    },
    order: [
      ["transactionDate", "ASC"],
      ["createdAt", "ASC"],
    ],
  });

  // Recalculate Running Balance
  for (const entry of entries) {

    runningBalance =
      runningBalance +
      Number(entry.credit) -
      Number(entry.debit);

    await entry.update({
      balance: runningBalance,
    });
  }

  // Update Customer Balance
  await customer.update({
    currentBalance: runningBalance,
  });

  return runningBalance;
};