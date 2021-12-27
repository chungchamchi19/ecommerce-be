import { Pagination } from "../../types/type.pagination";
import { getRepository } from "typeorm";
import { Media } from "../../entities/media";

const createMedia = async (params: { url: string; type: string }): Promise<Media> => {
  const mediaRepo = getRepository(Media);
  const media = new Media();
  media.link = params.url;
  media.type = params.type;
  return await mediaRepo.save(mediaRepo.create(media));
};

const getMediaById = async (id: number): Promise<Media> => {
  const mediaRepo = getRepository(Media);
  const media = await mediaRepo.findOne({ id: id });
  return media;
};

const updateMedia = async (id: number, data: Media): Promise<Media> => {
  const mediaRepo = getRepository(Media);
  await mediaRepo.update(id, data);
  return data;
};

const getMedias = async (params: { pagination: Pagination }): Promise<Media[]> => {
  const mediaRepo = getRepository(Media);
  const medias = await mediaRepo.createQueryBuilder("m").skip(params.pagination.offset).take(params.pagination.limit).getMany();
  return medias;
};

const mediaDaos = {
  createMedia,
  getMediaById,
  updateMedia,
  getMedias,
};

export default mediaDaos;
