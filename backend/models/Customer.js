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

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
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

// Relationship
User.hasMany(Customer, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Customer.belongsTo(User, {
  foreignKey: "userId",
});

export default Customer;