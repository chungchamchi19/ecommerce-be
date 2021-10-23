"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = __importDefault(require("../modules/auth/controllers"));
const async_1 = __importDefault(require("../middlewares/async"));
const router = express_1.default.Router();
router.post('/auth/register', async_1.default(controllers_1.default.register));
router.post('/auth/login', async_1.default(controllers_1.default.login));
router.get('/me', async_1.default(controllers_1.default.me));
exports.default = router;
