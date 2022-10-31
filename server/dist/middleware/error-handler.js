"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    const defaultError = {
        message: err.message || "Something went wrong, try again later",
        status: err.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
    };
    if (err.name === "ValidationError") {
        defaultError.message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
        defaultError.status = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    if (err.code && err.code === 11000) {
        defaultError.status = http_status_codes_1.StatusCodes.BAD_REQUEST;
        defaultError.message = `${Object.keys(err.keyValue)} field has to be unique.`;
    }
    res.status(defaultError.status).json({ message: defaultError.message });
};
exports.default = errorHandlerMiddleware;
