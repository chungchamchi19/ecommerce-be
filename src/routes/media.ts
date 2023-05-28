import multer from "multer";
import express, { Request } from "express";
import mediaControllers from "../modules/media/controllers";
import asyncMiddleware from "../middlewares/async";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, "uploads");
  },
  filename: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/media", upload.array("files"), asyncMiddleware(mediaControllers.uploadImage));
router.get("/media/:id", asyncMiddleware(mediaControllers.getMediaById));

export default router;
