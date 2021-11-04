import { Media } from "../../entities/media";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
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

const updateMedia = async (
  id: number,
  mediaData: Media,
  oldTargetData?: { targetId: number; targetType: string },
): Promise<Media> => {
  const updateMedia = await mediaDaos.getMediaById(id);
  if (!updateMedia) {
    throw new CustomError(codes.NOT_FOUND, "Media not found!");
  }
  // nếu media này đã đc gắn với 1 sản phầm nào đó thì dung lai
  if (
    updateMedia.targetId &&
    updateMedia.targetType &&
    (!oldTargetData ||
      updateMedia.targetId !== oldTargetData.targetId ||
      updateMedia.targetType !== oldTargetData.targetType)
  ) {
    throw new CustomError(codes.BAD_REQUEST, "Media can not update!");
  }
  delete mediaData.id;
  const newMedia = {
    ...updateMedia,
    ...mediaData,
  };
  mediaDaos.updateMedia(id, mediaData);
  return newMedia;
};

const mediaServices = {
  createMedia,
  getMediaById,
  updateMedia,
};

export default mediaServices;