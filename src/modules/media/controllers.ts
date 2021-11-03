import { Request, Response } from "express";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import mediaServices from "./services";
import { Media } from "../../entities/media";
import fs from "fs";

const uploadImage = async (req: Request, res: Response) => {
  if (!req.files?.length) {
    throw new CustomError(codes.NOT_FOUND);
  }
  const listMedia: Media[] = await mediaServices.createMedia(req.files as Express.Multer.File[]);
  res.status(200).json({
    status: "success",
    result: listMedia,
  });
};

const getMediaById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const media: Media = await mediaServices.getMediaById(Number(id));
  if (!media) {
    throw new CustomError(codes.NOT_FOUND);
  }
  const filePath = "./" + media.link;
  const mediaStream = fs.createReadStream(filePath);
  const fileStat = fs.statSync(filePath);
  if (media.type === "image") {
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Length", fileStat.size);
    res.setHeader("Accept-Ranges", "bytes");
  } else if (media.type === "video") {
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Length", fileStat.size);
    res.setHeader("Accept-Ranges", "bytes");
  }
  mediaStream.on("open", function () {
    mediaStream.pipe(res);
  });
  mediaStream.on("error", function (err) {
    res.end(err);
  });
};

export default { uploadImage, getMediaById };
