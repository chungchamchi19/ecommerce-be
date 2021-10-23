import { TagType } from '../../../types/type.tag';
import services from '../services';

const create = async (req: any, res: any) => {
  const data = req.body;
  const tagData: TagType = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: req.user.id,
    isDeleted: false,
  };
  const newTag = await services.create(tagData);
  return res.status(200).json({
    status: 'success',
    result: newTag,
  });
};

export default { create };
