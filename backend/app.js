import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

// 1. Load environment variables FIRST
const envResult = config({ path: "./config/config.env" });
if (envResult.error) {
    console.log("🚨 DOTENV ERROR:", envResult.error.message);
} else {
    console.log("✅ Dotenv loaded successfully!");
}

// 2. Initialize Sequelize models + associations AFTER env vars are loaded
const { initModels } = await import("./models/index.js");
initModels();

// 3. Now import routers (which import controllers → which import models)
//    Models are already initialized above, so the exports will be populated.
const { default: messageRouter } = await import("./router/messageRouter.js");
const { default: userRouter } = await import("./router/userRouter.js");
const { default: appointmentRouter } = await import("./router/appointmentRouter.js");

// Middleware to enable Cross-Origin Resource Sharing, so your frontend (hosted elsewhere) can access your API.
// CORS -- Cross-Origin Resource Sharing.

app.use(cors({
    origin: [
        process.env.FRONTEND_URL, 
        process.env.DASHBOARD_URL,
        "https://zee-care-hospital-pi.vercel.app",
        "https://zee-care-hospital-kdxh.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // credential can also be sent as reqs
}));
app.use(cookieParser());
app.use(express.json()); // middle ware for json requests
app.use(express.urlencoded({ extended: true })); // middle ware to access forms
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

dbConnection();
app.use(errorMiddleware);
export default app;
