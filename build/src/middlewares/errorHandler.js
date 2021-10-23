"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const codes_1 = __importDefault(require("../errors/codes"));
const getErrorMessage_1 = __importDefault(require("../errors/getErrorMessage"));
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let statusCode = err.code || err.statusCode;
    let { message } = err;
    let details;
    const code = err.code || err.statusCode || codes_1.default.INTERNAL_SERVER_ERROR;
    switch (code) {
        case codes_1.default.BAD_REQUEST:
            message = message || 'Bad Request';
            details = err.details;
            break;
        case codes_1.default.UNAUTHORIZED:
            message = 'Unauthorized';
            break;
        case codes_1.default.FORBIDDEN:
            message = 'Forbidden';
            break;
        case codes_1.default.NOT_FOUND:
            message = 'Not Found';
            break;
        case codes_1.default.TOO_MANY_REQUESTS:
            message = 'Too many requests';
            break;
        case codes_1.default.INTERNAL_SERVER_ERROR:
            statusCode = codes_1.default.INTERNAL_SERVER_ERROR;
            message = message || 'Something went wrong';
            break;
        case codes_1.default.DUPLICATE:
            statusCode = codes_1.default.INTERNAL_SERVER_ERROR;
            message = message || 'Duplicate';
            break;
        default:
            message = message || getErrorMessage_1.default(code);
            statusCode = 200;
    }
    return res.status(statusCode).json({
        status: 'fail',
        message: message,
        statusCode: statusCode,
        details: details,
    });
};
exports.default = errorHandler;
