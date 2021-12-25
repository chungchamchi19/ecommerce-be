import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import { ArticleCreateParamsType, ArticleUpdateParamsType } from "../../types/type.article";
import { Pagination } from "../../types/type.pagination";
import articleTagServices from "../articleTag/services";
import articleDao from "./daos";

const createArticle = async (article: ArticleCreateParamsType, tags: { id: number }[] = []) => {
  const newArticle = await articleDao.createArticle(article);
  await tags.forEach(async (tag) => {
    await articleTagServices.create({
      articleId: newArticle.id,
      tagId: tag.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });
  });
  const articleRes = await articleDao.getArticleById(newArticle.id);
  return articleRes;
};

const getArticlesByUserId = async (userId: number, pagination: Pagination) => {
  const result = await articleDao.getArticlesByUserId({ userId, ...pagination });
  return result;
};

const getArticleById = async (id: number) => {
  const article = await articleDao.getArticleById(id);
  if (!article) {
    throw new CustomError(codes.NOT_FOUND, "Article not found!");
  }
  const relativeArticles = await articleDao.getArticlesByUserId({
    userId: article.userId,
    exceptArticleId: article.id,
    limit: 8,
  });
  return {
    article,
    relativeArticles,
  };
};

const updateArticleById = async (articleId: number, articleData: ArticleUpdateParamsType, tags: { id: number; articleTagId?: number }[]) => {
  return await articleDao.updateArticle(articleId, articleData, tags);
};

const getAllArticles = async (params: Pagination) => {
  return await articleDao.getAllArticles(params);
};

export default { createArticle, getArticlesByUserId, getArticleById, updateArticleById, getAllArticles };
