import express from "express";
import asyncMiddleware from "../middlewares/async";
import userMetaControllers from "../modules/user-meta/controllers";

const router = express.Router();

router.post("/user-metas", asyncMiddleware(userMetaControllers.create));
router.get("/user-metas", asyncMiddleware(userMetaControllers.getByKey));
router.get("/user-metas/:id", asyncMiddleware(userMetaControllers.getById));
router.put("/user-metas/:id", asyncMiddleware(userMetaControllers.update));
router.delete("/user-metas/:id", asyncMiddleware(userMetaControllers.deleteById));

export default router;
