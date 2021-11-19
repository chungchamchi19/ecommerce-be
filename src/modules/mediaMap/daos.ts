import { getRepository, In } from "typeorm";
import { MediaMap } from "../../entities/mediaMap";

const createMediaMap = async (params: MediaMap): Promise<MediaMap> => {
  const mediaMapRepo = getRepository(MediaMap);
  const mediaMap = new MediaMap();
  mediaMap.targetId = params.targetId || null;
  mediaMap.targetType = params.targetType || null;
  mediaMap.mediaId = params.mediaId || null;
  return await mediaMapRepo.save(mediaMapRepo.create(mediaMap));
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

const deleteMediaMaps = async (list: MediaMap[]) => {
  const mediaMapRepo = getRepository(MediaMap);
  for (let i = 0; i < list.length; i++) {
    const mediaMap = list[i];
    await mediaMapRepo
      .createQueryBuilder()
      .where("mediaId = :mediaId and targetId = :targetId and targetType = :targetType")
      .setParameters({
        mediaId: mediaMap.mediaId,
        targetId: mediaMap.targetId,
        targetType: mediaMap.targetType,
      })
      .delete()
      .execute();
  }
  return list;
};

const mediaMapDaos = {
  createMediaMap,
  getMediaMapById,
  updateMediaMap,
  getMediaMapsByListId,
  deleteMediaMapById,
  deleteMediaMaps,
};

export default mediaMapDaos;
