"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const async_1 = __importDefault(require("../middlewares/async"));
const controllers_1 = __importDefault(require("../modules/article/controllers"));
const router = express_1.default.Router();
router.post('/users/:userId/articles', async_1.default(controllers_1.default.createArticle));
router.put('/users/:userId/articles/:articleId', async_1.default(controllers_1.default.updateArticleById));
router.get('/users/:userId/articles', async_1.default(controllers_1.default.getArticles));
router.get('/users/:userId/articles/:articleId', async_1.default(controllers_1.default.getArticleById));
exports.default = router;
