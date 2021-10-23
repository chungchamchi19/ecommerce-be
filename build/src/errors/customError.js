"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getErrorMessage_1 = __importDefault(require("./getErrorMessage"));
class CustomError {
    constructor(code, message) {
        this.code = code;
        this.message = getErrorMessage_1.default(code) || message;
    }
}
exports.default = CustomError;
