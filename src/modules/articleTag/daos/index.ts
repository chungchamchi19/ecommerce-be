import { ArticleTag } from "../../../entities/articleTag";
import { getRepository } from "typeorm";

const createArticleTag = async (articleTagDTO: ArticleTag) => {
  const articleTagRepo = getRepository(ArticleTag);
  const newArticleTag = articleTagRepo.create(articleTagDTO);
  return await articleTagRepo.save(newArticleTag);
};

export default { createArticleTag };
