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
exports.generateAccessToken = exports.compareBcrypt = exports.hashBcrypt = exports.generateSalt = exports.verifyAccessToken = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = __importDefault(require("../../../configs"));
const user_1 = __importDefault(require("../daos/user"));
const verifyAccessToken = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const data = jsonwebtoken_1.default.verify(accessToken, configs_1.default.JWT_SECRET_KEY);
    const { userId } = data;
    const user = yield user_1.default.findUser({ id: userId });
    return user;
});
exports.verifyAccessToken = verifyAccessToken;
const generateSalt = (rounds) => {
    return bcrypt_1.default.genSaltSync(rounds);
};
exports.generateSalt = generateSalt;
const hashBcrypt = (text, salt) => {
    const hashedBcrypt = new Promise((resolve, reject) => {
        bcrypt_1.default.hash(text, salt, (err, hash) => {
            if (err)
                reject(err);
            resolve(hash);
        });
    });
    return hashedBcrypt;
};
exports.hashBcrypt = hashBcrypt;
const compareBcrypt = (data, hashed) => __awaiter(void 0, void 0, void 0, function* () {
    const isCorrect = yield new Promise((resolve, reject) => {
        bcrypt_1.default.compare(data, hashed, (err, same) => {
            if (err)
                reject(err);
            resolve(same);
        });
    });
    return isCorrect;
});
exports.compareBcrypt = compareBcrypt;
const generateAccessToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = jsonwebtoken_1.default.sign({ userId }, configs_1.default.JWT_SECRET_KEY, {
        expiresIn: configs_1.default.JWT_EXPIRES_TIME,
    });
    return accessToken;
});
exports.generateAccessToken = generateAccessToken;
