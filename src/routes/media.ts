import express from "express";
import mediaControllers from "../modules/media/controllers";
import asyncMiddleware from "../middlewares/async";

const router = express.Router();

router.post("/media", asyncMiddleware(mediaControllers.uploadImage));

export default router;
