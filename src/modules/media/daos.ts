import { getRepository } from "typeorm";
import { Media } from "../../entities/media";

const createMedia = async (params: {
  url: string;
  type: string;
  targetId?: number;
  targetType?: string;
}): Promise<Media> => {
  const mediaRepo = getRepository(Media);
  const media = new Media();
  media.link = params.url;
  media.targetId = params.targetId || null;
  media.targetType = params.targetType || null;
  media.createdAt = new Date();
  media.updatedAt = new Date();
  media.type = params.type;
  return await mediaRepo.save(media);
};

const getMediaById = async (id: number): Promise<Media> => {
  const mediaRepo = getRepository(Media);
  const media = await mediaRepo.findOne({ id: id });
  return media;
};

const mediaDaos = {
  createMedia,
  getMediaById,
};

export default mediaDaos;
