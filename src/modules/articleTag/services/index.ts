import { ArticleTag } from "../../../entities/articleTag";
import daos from "../daos";

const create = async (articleTag: ArticleTag) => {
  return await daos.createArticleTag(articleTag);
};

export default { create };
