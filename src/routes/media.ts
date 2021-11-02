import multer from "multer";
import express from "express";
import mediaControllers from "../modules/media/controllers";
import asyncMiddleware from "../middlewares/async";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/media", upload.array("files"), asyncMiddleware(mediaControllers.uploadImage));
router.get("/media/:id", asyncMiddleware(mediaControllers.getMediaById));

export default router;
