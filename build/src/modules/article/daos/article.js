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
const configs_1 = __importDefault(require("../../../configs"));
const article_1 = require("../../../entities/article");
const user_1 = require("../../../entities/user");
const daos_1 = __importDefault(require("../../articleTag/daos"));
const createArticle = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const articleRepository = typeorm_1.getRepository(article_1.Article);
    const articleData = Object.assign(Object.assign({}, data), { createdAt: new Date(), updatedAt: new Date(), isDeleted: false });
    const article = articleRepository.create(articleData);
    return yield articleRepository.save(article);
});
const getArticleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const articleRepository = typeorm_1.getRepository(article_1.Article);
    const article = yield articleRepository
        .createQueryBuilder('a')
        .leftJoinAndSelect('a.articleTags', 'at', 'at.isDeleted = false')
        .leftJoinAndSelect('at.tag', 't', 't.isDeleted = false')
        .where(`a.id = ${id} and a.isDeleted = false`)
        .getOne();
    return article;
});
const getArticlesByUserId = (condition) => __awaiter(void 0, void 0, void 0, function* () {
    const articleRepository = typeorm_1.getRepository(article_1.Article);
    let whereConditionGetArticle = `a.userId = ${condition.userId} and a.isDeleted = false`;
    if (condition.exceptArticleId) {
        whereConditionGetArticle += ` and a.id != ${condition.exceptArticleId}`;
    }
    const articles = yield articleRepository
        .createQueryBuilder('a')
        .leftJoinAndSelect('a.articleTags', 'at')
        .leftJoinAndSelect('at.tag', 't', 't.isDeleted = false')
        .where(whereConditionGetArticle)
        .orderBy('a.createdAt', 'DESC')
        .take(condition.limit || configs_1.default.MAX_RECORDS_PER_REQ)
        .getMany();
    return articles;
});
const updateArticle = (articleId, data, tags) => __awaiter(void 0, void 0, void 0, function* () {
    const articleRepository = typeorm_1.getRepository(article_1.Article);
    const articleData = Object.assign(Object.assign({}, data), { updatedAt: new Date() });
    yield articleRepository.update(articleId, articleData);
    yield tags.forEach((tag) => __awaiter(void 0, void 0, void 0, function* () {
        if (!tag.articleTagId) {
            yield daos_1.default.createArticleTag({
                articleId: articleId,
                tagId: tag.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
            });
        }
    }));
    const article = yield articleRepository.findOne(articleId);
    return article;
});
const getArticlesByTagId = (tagId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const articleRepository = typeorm_1.getRepository(article_1.Article);
    const articles = yield articleRepository
        .createQueryBuilder('a')
        .innerJoin('a.articleTags', 'at', `at.tagId = ${tagId} and at.isDeleted = false`)
        .where(`a.userId = ${userId} and a.isDeleted = false`)
        .getMany();
    return articles;
});
const getArticlesByUserIdFilterByTag = (condition) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = typeorm_1.getRepository(user_1.User);
    const data = yield userRepository
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.tags', 't')
        .leftJoinAndSelect('t.articles', 'a')
        .where(`a.userId = ${condition.userId} and a.isDeleted = false`);
    return data;
});
exports.default = {
    createArticle,
    getArticleById,
    getArticlesByUserId,
    updateArticle,
    getArticlesByTagId,
    getArticlesByUserIdFilterByTag,
};
