import { getRepository } from 'typeorm';
import configs from '../../../configs';
import { Article } from '../../../entities/article';
import { User } from '../../../entities/user';
import { ArticleCreateParamsType, ArticleUpdateParamsType } from '../../../types/type.article';
import articleTagDaos from '../../articleTag/daos';

const createArticle = async (data: ArticleCreateParamsType) => {
  const articleRepository = getRepository(Article);
  const articleData = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };
  const article = articleRepository.create(articleData);
  return await articleRepository.save(article);
};

const getArticleById = async (id: number) => {
  const articleRepository = getRepository(Article);
  const article = await articleRepository
    .createQueryBuilder('a')
    .leftJoinAndSelect('a.articleTags', 'at', 'at.isDeleted = false')
    .leftJoinAndSelect('at.tag', 't', 't.isDeleted = false')
    .where(`a.id = ${id} and a.isDeleted = false`)
    .getOne();
  return article;
};

const getArticlesByUserId = async (condition: { userId: number; exceptArticleId?: number; limit?: number }) => {
  const articleRepository = getRepository(Article);
  let whereConditionGetArticle = `a.userId = ${condition.userId} and a.isDeleted = false`;
  if (condition.exceptArticleId) {
    whereConditionGetArticle += ` and a.id != ${condition.exceptArticleId}`;
  }
  const articles = await articleRepository
    .createQueryBuilder('a')
    .leftJoinAndSelect('a.articleTags', 'at')
    .leftJoinAndSelect('at.tag', 't', 't.isDeleted = false')
    .where(whereConditionGetArticle)
    .orderBy('a.createdAt', 'DESC')
    .take(condition.limit || configs.MAX_RECORDS_PER_REQ)
    .getMany();
  return articles;
};

const updateArticle = async (
  articleId: number,
  data: ArticleUpdateParamsType,
  tags: { id: number; articleTagId?: number }[],
) => {
  const articleRepository = getRepository(Article);
  const articleData = {
    ...data,
    updatedAt: new Date(),
  };
  await articleRepository.update(articleId, articleData);
  await tags.forEach(async (tag) => {
    if (!tag.articleTagId) {
      await articleTagDaos.createArticleTag({
        articleId: articleId,
        tagId: tag.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });
    }
  });
  const article: Article = await articleRepository.findOne(articleId);
  return article;
};

const getArticlesByTagId = async (tagId: number, userId: number) => {
  const articleRepository = getRepository(Article);
  const articles = await articleRepository
    .createQueryBuilder('a')
    .innerJoin('a.articleTags', 'at', `at.tagId = ${tagId} and at.isDeleted = false`)
    .where(`a.userId = ${userId} and a.isDeleted = false`)
    .getMany();
  return articles;
};

const getArticlesByUserIdFilterByTag = async (condition: { userId: number; limit?: number }) => {
  const userRepository = getRepository(User);
  const data = await userRepository
    .createQueryBuilder('u')
    .leftJoinAndSelect('u.tags', 't')
    .leftJoinAndSelect('t.articles', 'a')
    .where(`a.userId = ${condition.userId} and a.isDeleted = false`);
  return data;
};

export default {
  createArticle,
  getArticleById,
  getArticlesByUserId,
  updateArticle,
  getArticlesByTagId,
  getArticlesByUserIdFilterByTag,
};
