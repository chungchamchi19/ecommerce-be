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
const user_1 = __importDefault(require("../daos/user"));
const helper_1 = require("./helper");
const customError_1 = __importDefault(require("../../../errors/customError"));
const codes_1 = __importDefault(require("../../../errors/codes"));
const register = (dataRegister) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = dataRegister;
    const salt = helper_1.generateSalt(10);
    const hashPassword = (yield helper_1.hashBcrypt(password, salt));
    const user = yield user_1.default.createUser({ email, password: hashPassword, name });
    return user;
});
const login = (dataLogin) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = dataLogin;
    const user = yield user_1.default.findUser({ email });
    if (!user)
        throw new customError_1.default(codes_1.default.USER_NOT_FOUND);
    const isCorrectPassword = yield helper_1.compareBcrypt(password, user.password);
    if (!isCorrectPassword)
        throw new customError_1.default(codes_1.default.WRONG_PASSWORD);
    const userId = user.id;
    const token = yield helper_1.generateAccessToken(userId);
    return Object.assign(Object.assign({}, user), { token });
});
exports.default = { register, login };
