import { getRepository, In } from "typeorm";
import { MediaMap } from "../../entities/mediaMap";

const createMediaMap = async (params: MediaMap): Promise<MediaMap> => {
  const mediaMapRepo = getRepository(MediaMap);
  const mediaMap = new MediaMap();
  mediaMap.targetId = params.targetId || null;
  mediaMap.targetType = params.targetType || null;
  mediaMap.mediaId = params.mediaId || null;
  return await mediaMapRepo.save(mediaMap);
};

const getMediaMapById = async (id: number): Promise<MediaMap> => {
  const mediaMapRepo = getRepository(MediaMap);
  const mediaMap = await mediaMapRepo
    .createQueryBuilder("mm")
    .leftJoinAndSelect("mm.media", "m")
    .where(`mm.id = ${id}`)
    .getOne();
  return mediaMap;
};

const getMediaMapsByListId = async (listId: number[]): Promise<MediaMap[]> => {
  const mediaMapRepo = getRepository(MediaMap);
  const mediaMap = await mediaMapRepo
    .createQueryBuilder("mm")
    .leftJoinAndSelect("mm.media", "m")
    .where(`mm.id in (${listId.join(",")})`)
    .getMany();
  return mediaMap;
};

const updateMediaMap = async (id: number, data: MediaMap): Promise<MediaMap> => {
  const mediaRepo = getRepository(MediaMap);
  await mediaRepo.update(id, data);
  return data;
};

const deleteMediaMapById = async (id: number) => {
  const mediaMapRepo = getRepository(MediaMap);
  const mediaMap = await mediaMapRepo.delete(id);
  return mediaMap;
};

const deleteMediaMapsByListId = async (listId: number[]) => {
  const mediaMapRepo = getRepository(MediaMap);
  const mediaMap = await mediaMapRepo
    .createQueryBuilder("mm")
    .where(`mm.id in (${listId.join(",")})`)
    .delete();
  return mediaMap;
};

const mediaMapDaos = {
  createMediaMap,
  getMediaMapById,
  updateMediaMap,
  getMediaMapsByListId,
  deleteMediaMapById,
  deleteMediaMapsByListId,
};

export default mediaMapDaos;
