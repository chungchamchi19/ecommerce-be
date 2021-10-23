import { Request, Response } from 'express';
import codes from '../../../errors/codes';
import CustomError from '../../../errors/customError';
import articleService from '../services/article';

const createArticle = async (req: Request, res: Response) => {
  const { title, description, content, avatar, tags } = req.body;
  const currentUserId = req.user.id;
  const userIdParams = req.params.userId;
  if (Number(currentUserId) !== Number(userIdParams)) {
    throw new CustomError(codes.UNAUTHORIZED);
  }
  const article = await articleService.createArticle(
    { title, description, content, avatar, userId: currentUserId },
    tags,
  );
  delete article.userId;
  res.status(200).json({
    status: 'success',
    result: article,
  });
};

const getArticles = async (req: Request, res: Response) => {
  const userIdParams = req.params.userId;
  const currentUserId: number = req.user?.id;
  if (!currentUserId) {
    throw new CustomError(codes.NOT_FOUND);
  }
  if (Number(currentUserId) !== Number(userIdParams)) {
    throw new CustomError(codes.UNAUTHORIZED);
  }
  const articles = await articleService.getArticlesByUserId(currentUserId);
  res.status(200).json({
    status: 'success',
    result: articles,
  });
};

const getArticleById = async (req: Request, res: Response) => {
  const id: number = Number(req.params.articleId);
  const userIdParams = req.params.userId;
  const currentUserId: number = req.user?.id;
  if (!currentUserId) {
    throw new CustomError(codes.NOT_FOUND);
  }
  if (Number(currentUserId) !== Number(userIdParams)) {
    throw new CustomError(codes.UNAUTHORIZED);
  }
  const response = await articleService.getArticleById(id);
  if (Number(currentUserId) !== Number(response?.article?.userId)) {
    throw new CustomError(codes.UNAUTHORIZED);
  }
  res.status(200).json({
    status: 'success',
    result: response,
  });
};

const updateArticleById = async (req: Request, res: Response) => {
  const id: number = Number(req.params.articleId);
  const userIdParams = req.params.userId;
  const currentUserId: number = req.user?.id;
  if (!currentUserId) {
    throw new CustomError(codes.NOT_FOUND);
  }
  if (Number(currentUserId) !== Number(userIdParams)) {
    throw new CustomError(codes.UNAUTHORIZED);
  }
  const tagIds = req.body.tagIds;
  const dataUpdate = req.body;
  delete dataUpdate.tagIds;
  const article = await articleService.updateArticleById(id, dataUpdate, tagIds);
  if (Number(currentUserId) !== Number(article.userId)) {
    throw new CustomError(codes.UNAUTHORIZED);
  }
  res.status(200).json({
    status: 'success',
    result: article,
  });
};

export default { createArticle, getArticles, getArticleById, updateArticleById };
