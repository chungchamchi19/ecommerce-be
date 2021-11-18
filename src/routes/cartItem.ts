import express from "express";
import asyncMiddleware from "../middlewares/async";
import cartItemController from "../modules/cartItem/controllers";
const router = express.Router();
router.post("/cart-items", asyncMiddleware(cartItemController.createCartItem));
router.put("/cart-items/:id", asyncMiddleware(cartItemController.updateCartItem));
router.get("/cart-items/:id", asyncMiddleware(cartItemController.getCartItemById));
router.delete("/cart-items/:id", asyncMiddleware(cartItemController.deleteCartItem));
export default router;
