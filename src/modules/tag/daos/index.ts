import { appDataSource } from "./../../../database/connectDB";
import { Tag } from "../../../entities/tag";
import { TagType } from "../../../types/type.tag";

const createTag = async (tagDTO: TagType) => {
  const tagRepository = appDataSource.getRepository(Tag);
  const tag = tagRepository.create(tagDTO);
  return await tagRepository.save(tag);
};

export default { createTag };
