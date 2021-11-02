import { Media } from "../../entities/media";
import mediaDaos from "./daos";

const createMedia = async (files: Express.Multer.File[]): Promise<Media[]> => {
  const listMedia: Media[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileData = {
      url: file.path,
      type: file.mimetype.split("/")[0],
    };
    const newMedia = await mediaDaos.createMedia(fileData);
    delete newMedia.link;
    listMedia.push(newMedia);
  }
  return listMedia;
};

const getMediaById = async (id: number): Promise<Media> => {
  return await mediaDaos.getMediaById(id);
};

const mediaServices = {
  createMedia,
  getMediaById,
};

export default mediaServices;
