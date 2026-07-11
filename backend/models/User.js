import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
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
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    profileImage: {
      type: DataTypes.STRING,
      defaultValue: "",
    },

    address: {
      type: DataTypes.TEXT,
    },

    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default User;