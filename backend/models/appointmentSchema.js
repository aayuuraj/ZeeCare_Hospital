import { DataTypes } from "sequelize";
import { getSequelize } from "../database/dbConnection.js";

let Appointment = null;

export function initAppointmentModel() {
  if (Appointment) return Appointment;

  const sequelize = getSequelize();

  Appointment = sequelize.define(
    "Appointment",
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
      appointment_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      appointment_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hasVisited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // Foreign Key — references Users table (doctor)
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Foreign Key — references Users table (patient)
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Accepted", "Rejected"),
        defaultValue: "Pending",
      },
    },
    {
      tableName: "Appointments",
      timestamps: true,
    }
  );

  // Backward compatibility: alias `id` as `_id` in JSON responses
  const originalToJSON = Appointment.prototype.toJSON;
  Appointment.prototype.toJSON = function () {
    const values = originalToJSON.call(this);
    values._id = values.id;
    return values;
  };

  return Appointment;
}

export { Appointment };
