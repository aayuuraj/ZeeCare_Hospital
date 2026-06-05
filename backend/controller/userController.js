import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic, role } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role) {
        return next(new ErrorHandler("Please Fill Full Form", 400));
    }

    const user = await User.findOne({ where: { email } });

    if (user) {
        return next(new ErrorHandler("User already registered!", 400));
    }

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,
    });

    // Re-fetch without password (default scope excludes it)
    const createdUser = await User.findByPk(newUser.id);
    generateToken(createdUser, "User Registered!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    if (password !== confirmPassword) {
        return next(
            new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
        );
    }

    // Use 'withPassword' scope to include the password field
    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (!user) {
        return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }
    if (role !== user.role) {
        return next(new ErrorHandler(`User Not Found With This Role!`, 400));
    }

    // Re-fetch without password for the response
    const safeUser = await User.findByPk(user.id);
    generateToken(safeUser, "User logged in Successfully", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
        return next(new ErrorHandler("Please Fill Full Form", 400));
    }

    const isRegistered = await User.findOne({ where: { email } });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} With This Email Already exists!`));
    }

    await User.create({
        firstName, lastName, email, phone, password, gender, dob, nic, role: "Admin",
    });
    res.status(200).json({
        success: "true",
        message: "New Admin Registered",
    });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.findAll({ where: { role: "Doctor" } });
    res.status(200).json({
        success: true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(0), // More robust for cookie removal
        sameSite: "None", 
        secure: true,
        path: "/", // Include if used when setting the cookie
    }).json({
        success: true,
        message: "Admin logged Out successfully",
    });
});


export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(0), // More robust for cookie removal
        sameSite: "None", 
        secure: true,
        path: "/", // Include if used when setting the cookie
    }).json({
        success: true,
        message: "Patient logged Out successfully",
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avatar Required", 400));
    }

    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("File Format Not Supported", 400));
    }

    const { firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment) {
        return next(new ErrorHandler("Please provide full details", 400));
    }

    const isRegistered = await User.findOne({ where: { email } });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} already registered with this email`, 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.log("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary Error");
        return next(new ErrorHandler("Failed to upload avatar", 500));
    }

    const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
        role: "Doctor",
        docAvatarPublicId: cloudinaryResponse.public_id,
        docAvatarUrl: cloudinaryResponse.secure_url,
    });

    // Re-fetch to get the default scope (no password) + toJSON with docAvatar object
    const createdDoctor = await User.findByPk(doctor.id);

    res.status(200).json({
        success: true,
        message: "New Doctor Registered",
        doctor: createdDoctor,
    });
});
