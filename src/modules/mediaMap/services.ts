import { MediaMap } from "../../entities/mediaMap";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import mediaMapDaos from "./daos";

const createMediaMaps = async (mediaMaps: MediaMap[]): Promise<MediaMap[]> => {
  let listMediaMap: MediaMap[] = [];
  for (let i = 0; i < mediaMaps.length; i++) {
    const mediaMap = mediaMaps[i];
    const newMediaMap = await mediaMapDaos.createMediaMap(mediaMap);
    listMediaMap.push(newMediaMap);
  }
  const listId = listMediaMap.map((mediaMap: MediaMap) => {
    return mediaMap.id;
  });
  listMediaMap = await getMediaMapsByListId(listId);
  return listMediaMap;
};

const getMediaMapById = async (id: number): Promise<MediaMap> => {
  return await mediaMapDaos.getMediaMapById(id);
};

const getMediaMapsByListId = async (listId: number[]): Promise<MediaMap[]> => {
  return await mediaMapDaos.getMediaMapsByListId(listId);
};

const updateMediaMap = async (id: number, mediaMapData: MediaMap): Promise<MediaMap> => {
  const updateMediaMap = await mediaMapDaos.getMediaMapById(id);
  if (!updateMediaMap) {
    throw new CustomError(codes.NOT_FOUND, "Media map not found!");
  }
  delete mediaMapData.id;
  const newMediaMap = {
    ...updateMediaMap,
    ...mediaMapData,
  };
  mediaMapDaos.updateMediaMap(id, mediaMapData);
  return newMediaMap;
};

const deleteMediaMapById = async (id: number) => {
  return await mediaMapDaos.deleteMediaMapById(id);
};

const deleteMediaMapsByListId = async (listId: number[]) => {
  return await mediaMapDaos.deleteMediaMapsByListId(listId);
};

const mediaMapServices = {
  createMediaMaps,
  getMediaMapById,
  updateMediaMap,
  getMediaMapsByListId,
  deleteMediaMapById,
  deleteMediaMapsByListId,
};

export default mediaMapServices;
