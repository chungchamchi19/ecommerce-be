import express from "express";
import asyncMiddleware from "../middlewares/async";
import cartController from "../modules/cart/controllers";
import ROLES from "../constants/roles";
import { validateCreateCarts } from "../validations/cart";
const router = express.Router();

router.post("/cart", asyncMiddleware(cartController.createCart));
router.get("/user/:userId/cart", asyncMiddleware(cartController.getCartByUserId));
router.get("/user/cart/checkout", asyncMiddleware(cartController.getCheckoutInfor));
router.put("/cart/:id", asyncMiddleware(cartController));
router.get("/cart/:id", asyncMiddleware(cartController.getCartById));
router.get("/cart", asyncMiddleware(cartController.getCart));
export default router;
