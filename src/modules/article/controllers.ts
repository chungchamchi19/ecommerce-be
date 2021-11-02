import { Request, Response } from "express";
import configs from "../../configs";
import ROLES from "../../constants/roles";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import articleService from "./services";

const createArticle = async (req: Request, res: Response) => {
  const { title, description, content, avatar, tags } = req.body;
  const currentUserId = req.user.id;
  const article = await articleService.createArticle(
    { title, description, content, avatar, userId: currentUserId },
    tags,
  );
  delete article.userId;
  res.status(200).json({
    status: "success",
    result: article,
  });
};

const getArticles = async (req: Request, res: Response) => {
  const currentUserId: number = req.user?.id;
  if (!currentUserId) {
    throw new CustomError(codes.NOT_FOUND);
  }
  const articles = await articleService.getArticlesByUserId(currentUserId);
  res.status(200).json({
    status: "success",
    result: articles,
  });
};

const getArticleById = async (req: Request, res: Response) => {
  const id: number = Number(req.params.articleId);
  const currentUserId: number = req.user?.id;
  if (!currentUserId) {
    throw new CustomError(codes.NOT_FOUND);
  }
  const response = await articleService.getArticleById(id);
  res.status(200).json({
    status: "success",
    result: response,
  });
};

const updateArticleById = async (req: Request, res: Response) => {
  const id: number = Number(req.params.articleId);
  const currentUserId: number = req.user?.id;
  if (!currentUserId) {
    throw new CustomError(codes.NOT_FOUND);
  }
  const checkArticle = await articleService.getArticleById(id);
  if (checkArticle.article.userId !== currentUserId && req.user.role !== ROLES.ADMIN) {
    throw new CustomError(codes.FORBIDDEN);
  }
  const tagIds = req.body.tagIds;
  const dataUpdate = req.body;
  delete dataUpdate.tagIds;
  const article = await articleService.updateArticleById(id, dataUpdate, tagIds);
  if (Number(currentUserId) !== Number(article.userId)) {
    throw new CustomError(codes.UNAUTHORIZED);
  }
  res.status(200).json({
    status: "success",
    result: article,
  });
};

const getAllArticles = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;
  const articles = await articleService.getAllArticles({
    limit: Number(limit) || configs.MAX_RECORDS_PER_REQ,
    offset: Number(offset) || 0,
  });
  res.status(200).json({
    status: "success",
    result: articles,
  });
};

export default { createArticle, getArticles, getArticleById, updateArticleById, getAllArticles };
