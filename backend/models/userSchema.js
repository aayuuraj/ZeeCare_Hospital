import { DataTypes } from "sequelize";
import { getSequelize } from "../database/dbConnection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Lazy model definition — only runs after Sequelize instance is ready
let User = null;

export function initUserModel() {
  if (User) return User;

  const sequelize = getSequelize();

  User = sequelize.define(
    "User",
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
      nic: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [12, 12],
            msg: "NIC must be 12 digits!",
          },
        },
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: {
            msg: "DOB is required",
          },
        },
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female"),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8],
            msg: "Password must contain at least 8 characters!",
          },
        },
      },
      role: {
        type: DataTypes.ENUM("Admin", "Patient", "Doctor"),
        allowNull: false,
      },
      doctorDepartment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      docAvatarPublicId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      docAvatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "Users",
      timestamps: true,
      // Default scope hides the password field from queries
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        // Use User.scope('withPassword') when you need the password (e.g. login)
        withPassword: {
          attributes: {},
        },
      },
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  // Instance method: compare password
  User.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  // Instance method: generate JWT
  User.prototype.generateJsonWebToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  };

  // Backward compatibility: alias `id` as `_id` in JSON responses
  const originalToJSON = User.prototype.toJSON;
  User.prototype.toJSON = function () {
    const values = originalToJSON.call(this);
    values._id = values.id;
    // Also reconstruct the nested docAvatar object for frontend compatibility
    if (values.docAvatarPublicId || values.docAvatarUrl) {
      values.docAvatar = {
        public_id: values.docAvatarPublicId,
        url: values.docAvatarUrl,
      };
    }
    return values;
  };

  return User;
}

// Export a getter that ensures the model is initialized
export { User };
