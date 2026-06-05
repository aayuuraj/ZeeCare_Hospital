import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";
import { Op } from "sequelize";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        appointment_time,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address,
    } = req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_date ||
        !appointment_time ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName ||
        !address
    ) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    // Find the doctor by name, role, and department
    const isConflict = await User.findAll({
        where: {
            firstName: doctor_firstName,
            lastName: doctor_lastName,
            role: "Doctor",
            doctorDepartment: department,
        },
    });

    if (isConflict.length === 0) {
        return next(new ErrorHandler("Doctor not found!", 404));
    }
    if (isConflict.length > 1) {
        return next(
            new ErrorHandler(
                "Doctors Conflict! Please Contact Through Email and Phone!",
                404
            )
        );
    }

    const doctorId = isConflict[0].id;
    const patientId = req.user.id;

    const isBooked = await Appointment.findOne({
        where: {
            doctorId,
            appointment_date,
            appointment_time,
            status: {
                [Op.in]: ["Pending", "Accepted"]
            }
        }
    });

    if (isBooked) {
        return next(new ErrorHandler("Doctor already has an appointment at this time!", 400));
    }

    const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        appointment_time,
        department,
        hasVisited,
        address,
        doctorId,
        patientId,
    });

    res.status(200).json({
        success: true,
        message: "Appointment Sent Successfully",
    });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.findAll({
        include: [
            {
                model: User,
                as: "doctor",
                attributes: ["firstName", "lastName"],
            },
            {
                model: User,
                as: "patient",
                attributes: ["firstName", "lastName"],
            },
        ],
    });
    res.status(200).json({
        success: true,
        appointments,
    });
});

export const updateAppointmentStatus = catchAsyncErrors(
    async (req, res, next) => {
        const { id } = req.params;
        let appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return next(new ErrorHandler("Appointment Not Found", 400));
        }

        // Only allow updating specific fields (status, hasVisited)
        await appointment.update(req.body);

        // Re-fetch with associations for the response
        appointment = await Appointment.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "doctor",
                    attributes: ["firstName", "lastName"],
                },
            ],
        });

        res.status(200).json({
            success: true,
            message: "Appointment Status Updated",
            appointment,
        });
    }
);

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment Not Found", 400));
    }
    await appointment.destroy();
    res.status(200).json({
        success: true,
        message: "Appointment Deleted",
    });
});

export const getAvailableSlots = catchAsyncErrors(async (req, res, next) => {
    const { doctor_firstName, doctor_lastName, department, date } = req.query;

    if (!doctor_firstName || !doctor_lastName || !department || !date) {
        return next(new ErrorHandler("Doctor details and Date are required", 400));
    }

    const doctor = await User.findOne({
        where: {
            firstName: doctor_firstName,
            lastName: doctor_lastName,
            role: "Doctor",
            doctorDepartment: department,
        },
    });

    if (!doctor) {
        return next(new ErrorHandler("Doctor not found", 404));
    }

    const standardSlots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
        "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
        "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    ];

    const bookedAppointments = await Appointment.findAll({
        where: {
            doctorId: doctor.id,
            appointment_date: date,
            status: {
                [Op.in]: ["Pending", "Accepted"]
            }
        },
        attributes: ["appointment_time"]
    });

    const bookedSlots = bookedAppointments.map(app => app.appointment_time);
    const availableSlots = standardSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({
        success: true,
        availableSlots
    });
});