class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    // Sequelize Unique Constraint Error (replaces MongoDB duplicate key error code 11000)
    if (err.name === "SequelizeUniqueConstraintError") {
        const fields = err.errors.map((e) => e.path).join(", ");
        const message = `Duplicate value entered for: ${fields}`;
        err = new ErrorHandler(message, 400);
    }

    // Sequelize Validation Error (replaces MongoDB validation errors)
    if (err.name === "SequelizeValidationError") {
        const message = err.errors.map((e) => e.message).join(" ");
        err = new ErrorHandler(message, 400);
    }

    // Sequelize Foreign Key Constraint Error
    if (err.name === "SequelizeForeignKeyConstraintError") {
        const message = "Referenced record not found or cannot be deleted due to existing references.";
        err = new ErrorHandler(message, 400);
    }

    // Sequelize Database Error (bad query, wrong column type, etc.)
    if (err.name === "SequelizeDatabaseError") {
        const message = `Database Error: ${err.message}`;
        err = new ErrorHandler(message, 400);
    }

    // Sequelize Connection Error (replaces MongoNetworkError)
    if (err.name === "SequelizeConnectionError" || err.name === "SequelizeConnectionRefusedError") {
        const message = "Database connection failed.";
        err = new ErrorHandler(message, 500);
    }

    // Invalid JWT error
    if (err.name === "JsonWebTokenError") {
        const message = "Json Web Token is invalid, Try Again!";
        err = new ErrorHandler(message, 400);
    }

    // Expired JWT error
    if (err.name === "TokenExpiredError") {
        const message = "Json Web Token is expired, Try Again!";
        err = new ErrorHandler(message, 400);
    }

    // Handle missing JSON body (SyntaxError)
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        err = new ErrorHandler("Bad Request - Invalid JSON", 400);
    }

    // Unauthorized error (JWT/Authentication)
    if (err.name === "UnauthorizedError") {
        const message = "You are not authorized to access this resource.";
        err = new ErrorHandler(message, 401);
    }

    // Forbidden error (Authorization)
    if (err.name === "ForbiddenError") {
        const message = "You do not have permission to access this resource.";
        err = new ErrorHandler(message, 403);
    }

    // Catch all other errors
    if (!err.statusCode) {
        err = new ErrorHandler("An unknown error occurred.", 500);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;
