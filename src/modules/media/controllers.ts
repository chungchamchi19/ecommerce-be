import { Request, Response } from "express";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import mediaServices from "./services";
import { Media } from "../../entities/media";

const uploadImage = async (req: Request, res: Response) => {
  const { fileUrls } = req.body;
  if (!fileUrls) {
    throw new CustomError(codes.BAD_REQUEST, "fileUrls is required");
  }
  const listMedia: Media[] = await mediaServices.createMedia(fileUrls);
  res.status(200).json({
    status: "success",
    result: listMedia,
  });
};

export default { uploadImage };
