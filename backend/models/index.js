import { initUserModel } from "./userSchema.js";
import { initAppointmentModel } from "./appointmentSchema.js";
import { initMessageModel } from "./messageSchema.js";

/**
 * Initialize all models and set up associations.
 * Must be called AFTER dotenv has loaded (i.e. after config() in app.js).
 */
export function initModels() {
  const User = initUserModel();
  const Appointment = initAppointmentModel();
  const Message = initMessageModel();

  // ============================================
  // Associations
  // ============================================

  // Appointment belongs to a Doctor (User with role "Doctor")
  Appointment.belongsTo(User, {
    as: "doctor",
    foreignKey: "doctorId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Appointment belongs to a Patient (User with role "Patient")
  Appointment.belongsTo(User, {
    as: "patient",
    foreignKey: "patientId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // A Doctor (User) can have many Appointments
  User.hasMany(Appointment, {
    as: "doctorAppointments",
    foreignKey: "doctorId",
  });

  // A Patient (User) can have many Appointments
  User.hasMany(Appointment, {
    as: "patientAppointments",
    foreignKey: "patientId",
  });

  return { User, Appointment, Message };
}
