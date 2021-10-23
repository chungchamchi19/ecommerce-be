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
const codes_1 = __importDefault(require("../../../errors/codes"));
const customError_1 = __importDefault(require("../../../errors/customError"));
const article_1 = __importDefault(require("../services/article"));
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, content, avatar, tags } = req.body;
    const currentUserId = req.user.id;
    const userIdParams = req.params.userId;
    if (Number(currentUserId) !== Number(userIdParams)) {
        throw new customError_1.default(codes_1.default.UNAUTHORIZED);
    }
    const article = yield article_1.default.createArticle({ title, description, content, avatar, userId: currentUserId }, tags);
    delete article.userId;
    res.status(200).json({
        status: 'success',
        result: article,
    });
});
const getArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userIdParams = req.params.userId;
    const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!currentUserId) {
        throw new customError_1.default(codes_1.default.NOT_FOUND);
    }
    if (Number(currentUserId) !== Number(userIdParams)) {
        throw new customError_1.default(codes_1.default.UNAUTHORIZED);
    }
    const articles = yield article_1.default.getArticlesByUserId(currentUserId);
    res.status(200).json({
        status: 'success',
        result: articles,
    });
});
const getArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const id = Number(req.params.articleId);
    const userIdParams = req.params.userId;
    const currentUserId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    if (!currentUserId) {
        throw new customError_1.default(codes_1.default.NOT_FOUND);
    }
    if (Number(currentUserId) !== Number(userIdParams)) {
        throw new customError_1.default(codes_1.default.UNAUTHORIZED);
    }
    const response = yield article_1.default.getArticleById(id);
    if (Number(currentUserId) !== Number((_c = response === null || response === void 0 ? void 0 : response.article) === null || _c === void 0 ? void 0 : _c.userId)) {
        throw new customError_1.default(codes_1.default.UNAUTHORIZED);
    }
    res.status(200).json({
        status: 'success',
        result: response,
    });
});
const updateArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const id = Number(req.params.articleId);
    const userIdParams = req.params.userId;
    const currentUserId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    if (!currentUserId) {
        throw new customError_1.default(codes_1.default.NOT_FOUND);
    }
    if (Number(currentUserId) !== Number(userIdParams)) {
        throw new customError_1.default(codes_1.default.UNAUTHORIZED);
    }
    const tagIds = req.body.tagIds;
    const dataUpdate = req.body;
    delete dataUpdate.tagIds;
    const article = yield article_1.default.updateArticleById(id, dataUpdate, tagIds);
    if (Number(currentUserId) !== Number(article.userId)) {
        throw new customError_1.default(codes_1.default.UNAUTHORIZED);
    }
    res.status(200).json({
        status: 'success',
        result: article,
    });
});
exports.default = { createArticle, getArticles, getArticleById, updateArticleById };
