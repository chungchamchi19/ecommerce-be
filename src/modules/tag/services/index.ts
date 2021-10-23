import { TagType } from '../../../types/type.tag';
import tagDaos from '../daos';

const create = async (tagDTO: TagType) => {
  return await tagDaos.createTag(tagDTO);
};

export default { create };
