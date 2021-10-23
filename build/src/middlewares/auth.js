"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const codes_1 = __importDefault(require("../errors/codes"));
const customError_1 = __importDefault(require("../errors/customError"));
const helper_1 = require("../modules/auth/services/helper");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.path.includes('/auth')) {
        const { authorization } = req.headers;
        if (!authorization)
            throw new customError_1.default(codes_1.default.UNAUTHORIZED);
        const [tokenType, accessToken] = authorization.split(' ');
        if (tokenType !== 'Bearer')
            throw new customError_1.default(codes_1.default.UNAUTHORIZED);
        const user = yield helper_1.verifyAccessToken(accessToken);
        req.user = user;
        if (['/auths/logout', '/auths/verify'].includes(req.path)) {
            req.accessToken = accessToken;
        }
    }
    return next();
});
exports.default = authMiddleware;
