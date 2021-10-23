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
const services_1 = __importDefault(require("../../articleTag/services"));
const article_1 = __importDefault(require("../daos/article"));
const createArticle = (article, tags) => __awaiter(void 0, void 0, void 0, function* () {
    const newArticle = yield article_1.default.createArticle(article);
    yield tags.forEach((tag) => __awaiter(void 0, void 0, void 0, function* () {
        yield services_1.default.create({
            articleId: newArticle.id,
            tagId: tag.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
        });
    }));
    const articleRes = yield article_1.default.getArticleById(newArticle.id);
    return articleRes;
});
const getArticlesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const articles = yield article_1.default.getArticlesByUserId({ userId });
    return articles;
});
const getArticleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const article = yield article_1.default.getArticleById(id);
    const relativeArticles = yield article_1.default.getArticlesByUserId({
        userId: article.userId,
        exceptArticleId: article.id,
        limit: 8,
    });
    return {
        article,
        relativeArticles,
    };
});
const updateArticleById = (articleId, articleData, tags) => __awaiter(void 0, void 0, void 0, function* () {
    return yield article_1.default.updateArticle(articleId, articleData, tags);
});
exports.default = { createArticle, getArticlesByUserId, getArticleById, updateArticleById };
