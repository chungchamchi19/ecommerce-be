import { Pagination } from "../../types/type.pagination";
import { Media } from "../../entities/media";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import mediaDaos from "./daos";
import configs from "../../configs";

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

const updateMedia = async (id: number, mediaData: Media): Promise<Media> => {
  const updateMedia = await mediaDaos.getMediaById(id);
  if (!updateMedia) {
    throw new CustomError(codes.NOT_FOUND, "Media not found!");
  }
  delete mediaData.id;
  const newMedia = {
    ...updateMedia,
    ...mediaData,
  };
  mediaDaos.updateMedia(id, mediaData);
  return newMedia;
};

const getMedias = async (params: { pagination: Pagination }): Promise<Media[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  return await mediaDaos.getMedias({ pagination });
};

const mediaServices = {
  createMedia,
  getMediaById,
  updateMedia,
  getMedias,
};

export default mediaServices;
