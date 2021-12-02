import express from "express";
import asyncMiddleware from "../middlewares/async";
import cartController from "../modules/cart/controllers";
import ROLES from "../constants/roles";
import { validateCreateCarts } from "../validations/cart";
const router = express.Router();

router.post("/carts", asyncMiddleware(cartController.createCart));
router.get("/users/:userId/carts", asyncMiddleware(cartController.getCartByUserId));
router.put("/carts/:id", asyncMiddleware(cartController));
router.get("/carts/:id", asyncMiddleware(cartController.getCartById));
router.get("/carts", asyncMiddleware(cartController.getCarts));
export default router;
