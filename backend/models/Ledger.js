import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Customer from "./Customer.js";
import User from "./User.js";

const Ledger = sequelize.define(
  "Ledger",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    transactionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("Opening", "Milk", "Payment"),
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      defaultValue: "",
    },

    paymentMode: {
      type: DataTypes.ENUM("Cash", "UPI", "Bank", "Opening"),
      defaultValue: "Cash",
    },

    credit: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    debit: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Ledger, {
  foreignKey: "userId",
});

Ledger.belongsTo(User, {
  foreignKey: "userId",
});

Customer.hasMany(Ledger, {
  foreignKey: "customerId",
});

Ledger.belongsTo(Customer, {
  foreignKey: "customerId",
});

export default Ledger;