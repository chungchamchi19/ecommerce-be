import express from "express";
import asyncMiddleware from "../middlewares/async";
import shopInforController from "../modules/shopInfor/controllers";
import ROLES from "../constants/roles";
import { validateCreateShopInfor } from "../validations/shopInfor";
const router = express.Router();
router.post("/shop-infor", validateCreateShopInfor(ROLES.ADMIN), asyncMiddleware(shopInforController.createOrUpdateShopInfor));
router.get("/shop-infor",validateCreateShopInfor(ROLES.ADMIN), asyncMiddleware(shopInforController.getShopInfor));
export default router;
