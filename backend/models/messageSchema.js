import { DataTypes } from "sequelize";
import { getSequelize } from "../database/dbConnection.js";

let Message = null;

export function initMessageModel() {
  if (Message) return Message;

  const sequelize = getSequelize();

  Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3],
            msg: "First Name must be at least 3 characters!",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3],
            msg: "Last Name must be at least 3 characters!",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Please enter a valid email",
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [11, 11],
            msg: "Phone number must be 11 digits!",
          },
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [10],
            msg: "Message must be at least 10 characters!",
          },
        },
      },
    },
    {
      tableName: "Messages",
      timestamps: true,
    }
  );

  // Backward compatibility: alias `id` as `_id` in JSON responses
  const originalToJSON = Message.prototype.toJSON;
  Message.prototype.toJSON = function () {
    const values = originalToJSON.call(this);
    values._id = values.id;
    return values;
  };

  return Message;
}

export { Message };
