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
const typeorm_1 = require("typeorm");
const user_1 = require("../../../entities/user");
const codes_1 = __importDefault(require("../../../errors/codes"));
const customError_1 = __importDefault(require("../../../errors/customError"));
const connectDB_1 = __importDefault(require("./connectDB"));
const createUser = (dataRegister) => __awaiter(void 0, void 0, void 0, function* () {
    return yield connectDB_1.default
        .then((connection) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, password } = dataRegister;
        const user = new user_1.User();
        user.name = name;
        user.email = email;
        user.password = password;
        return connection.manager.save(user);
    }))
        .catch((e) => {
        console.log('err user: ', e);
        throw new customError_1.default(codes_1.default.DUPLICATE, e.message);
    });
});
const findUser = (dataFind) => __awaiter(void 0, void 0, void 0, function* () {
    const userReposity = typeorm_1.getRepository(user_1.User);
    let user;
    if (dataFind.email) {
        user = yield userReposity.findOne({
            where: {
                email: dataFind.email,
            },
        });
    }
    else if (dataFind.id) {
        user = yield userReposity.findOne({
            where: {
                id: dataFind.id,
            },
        });
    }
    return user;
});
exports.default = { createUser, findUser };
