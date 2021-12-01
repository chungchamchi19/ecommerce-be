import { validateCreateArticles } from "./../validations/articles";
import express from "express";
import asyncMiddleware from "../middlewares/async";
import articleController from "../modules/article/controllers";
import ROLES from "../constants/roles";
const router = express.Router();

router.post("/admin/articles", validateCreateArticles(ROLES.ADMIN), asyncMiddleware(articleController.createArticle));
router.put(
  "/admin/articles/:articleId",
  validateCreateArticles(ROLES.ADMIN),
  asyncMiddleware(articleController.updateArticleById),
);
router.get("/admin/articles", validateCreateArticles(ROLES.ADMIN), asyncMiddleware(articleController.getArticles));
router.get("/articles", asyncMiddleware(articleController.getAllArticles));
router.get("/articles/:articleId", asyncMiddleware(articleController.getArticleById));

export default router;
