"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const codes_1 = __importDefault(require("./codes"));
const getErrorMessage = (code) => {
    switch (code) {
        case codes_1.default.USER_NOT_FOUND:
            return 'User is not found';
        case codes_1.default.WRONG_PASSWORD:
            return 'Wrong password';
        case codes_1.default.NOT_FOUND:
            return 'Request not found';
        default:
            return null;
    }
};
exports.default = getErrorMessage;
