"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const async_1 = __importDefault(require("../middlewares/async"));
const controllers_1 = __importDefault(require("../modules/tag/controllers"));
const router = express_1.default.Router();
router.post('/tags', async_1.default(controllers_1.default.create));
exports.default = router;
