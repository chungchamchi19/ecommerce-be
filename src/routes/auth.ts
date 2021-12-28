import express from "express";
import auth from "../modules/auth/controllers";
import asyncMiddleware from "../middlewares/async";

const router = express.Router();

router.post("/auth/register", asyncMiddleware(auth.register));
router.post("/auth/register-by-device", asyncMiddleware(auth.createUserByDevice));
router.post("/auth/login", asyncMiddleware(auth.login));
router.get("/me", asyncMiddleware(auth.me));
router.put("/me/password", asyncMiddleware(auth.updatePassword));
router.put("/me", asyncMiddleware(auth.updateInfo));

export default router;
