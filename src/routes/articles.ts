import express from "express";
import asyncMiddleware from "../middlewares/async";
import articleController from "../modules/article/controllers";
const router = express.Router();

router.post("/users/:userId/articles", asyncMiddleware(articleController.createArticle));
router.put("/users/:userId/articles/:articleId", asyncMiddleware(articleController.updateArticleById));
router.get("/users/:userId/articles", asyncMiddleware(articleController.getArticles));
router.get("/users/:userId/articles/:articleId", asyncMiddleware(articleController.getArticleById));

export default router;
