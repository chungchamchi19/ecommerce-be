import express from "express";
import mediaControllers from "../modules/media/controllers";
import asyncMiddleware from "../middlewares/async";
import fileUpload from "express-fileupload";

const router = express.Router();

router.post("/media", fileUpload(), asyncMiddleware(mediaControllers.uploadImage));
router.get("/media/:id", asyncMiddleware(mediaControllers.getMediaById));

export default router;
