"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const connectDB = typeorm_1.createConnection();
exports.default = connectDB;
