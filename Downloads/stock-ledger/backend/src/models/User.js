import { DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("Staff", "Admin"),
      defaultValue: "Staff",
    },

    status: {
      type: DataTypes.ENUM("Active", "Suspended"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

User.prototype.toSafeJSON = function () {
  const { id, name, email, role, status, createdAt } = this;

  return {
    id,
    name,
    email,
    role,
    status,
    createdAt,
  };
};

export default User;
