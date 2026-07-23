import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Customer from "./Customer.js";
import User from "./User.js";

const MilkEntry = sequelize.define(
  "MilkEntry",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    entryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    session: {
      type: DataTypes.ENUM("Morning", "Evening"),
      allowNull: false,
    },

    quantity: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },

    rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    remarks: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(MilkEntry, {
  foreignKey: "userId",
});

MilkEntry.belongsTo(User, {
  foreignKey: "userId",
});

Customer.hasMany(MilkEntry, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
});

MilkEntry.belongsTo(Customer, {
  foreignKey: "customerId",
});

export default MilkEntry;