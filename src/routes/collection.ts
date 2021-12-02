import express from "express";
import asyncMiddleware from "../middlewares/async";
import collectionControllers from "../modules/collection/controllers";
const router = express.Router();

router.post("/admin/collections", asyncMiddleware(collectionControllers.createCollection));
router.get("/collections", asyncMiddleware(collectionControllers.getCollections));
router.get("/collections/:id", asyncMiddleware(collectionControllers.getCollectionById));
router.put("/collections/:id", asyncMiddleware(collectionControllers.updateCollection));
router.delete("/collections/:id", asyncMiddleware(collectionControllers.deleteCollection));

export default router;
