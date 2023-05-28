import { appDataSource } from "./../../../database/connectDB";
import { ArticleTag } from "../../../entities/articleTag";

const createArticleTag = async (articleTagDTO: ArticleTag) => {
  const articleTagRepo = appDataSource.getRepository(ArticleTag);
  const newArticleTag = articleTagRepo.create(articleTagDTO);
  return await articleTagRepo.save(newArticleTag);
};

export default { createArticleTag };
