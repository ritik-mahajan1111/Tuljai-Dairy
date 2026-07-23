import sequelize from "../config/database.js";

import User from "./User.js";
import Customer from "./Customer.js";
import MilkEntry from "./MilkEntry.js";
import Ledger from "./Ledger.js";

export {
  User,
  Customer,
  MilkEntry,
  Ledger,
};

export const syncDatabase = async () => {
  try {
    await sequelize.sync();

    console.log("✅ Database Synced Successfully");

  } catch (error) {
    console.log(error);
  }
};