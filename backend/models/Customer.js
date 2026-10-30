import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Customer = sequelize.define(
  "Customer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Original name entered by owner
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Automatically generated Hindi name
    hindiName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },

    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },

    village: {
      type: DataTypes.STRING,
      defaultValue: "",
    },

    customerCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    milkType: {
      type: DataTypes.ENUM("Cow", "Buffalo", "Mixed"),
      defaultValue: "Cow",
    },

    defaultRate: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    shift: {
      type: DataTypes.ENUM("Morning", "Evening", "Both"),
      defaultValue: "Both",
    },

    notes: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },

    profileImage: {
      type: DataTypes.STRING,
      defaultValue: "",
    },

    openingBalance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    currentBalance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
  },
  {
    timestamps: true,
  }
);


// ==========================================
// Relationship
// ==========================================

User.hasMany(Customer, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Customer.belongsTo(User, {
  foreignKey: "userId",
});

export default Customer;