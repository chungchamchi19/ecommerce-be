import { ArticleCreateParamsType, ArticleUpdateParamsType } from '../../../types/type.article';
import articleTagServices from '../../articleTag/services';
import articleDao from '../daos/article';

const createArticle = async (article: ArticleCreateParamsType, tags: { id: number }[]) => {
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

const getArticlesByUserId = async (userId: number) => {
  const articles = await articleDao.getArticlesByUserId({ userId });
  return articles;
};

const getArticleById = async (id: number) => {
  const article = await articleDao.getArticleById(id);
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

const updateArticleById = async (
  articleId: number,
  articleData: ArticleUpdateParamsType,
  tags: { id: number; articleTagId?: number }[],
) => {
  return await articleDao.updateArticle(articleId, articleData, tags);
};

export default { createArticle, getArticlesByUserId, getArticleById, updateArticleById };
