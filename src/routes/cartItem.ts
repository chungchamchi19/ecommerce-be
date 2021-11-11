// import { validateCreatecartItems } from "./../validations/articles";
import express from "express";
import asyncMiddleware from "../middlewares/async";
import cartItemController from "../modules/cartItem/controllers";
// import ROLES from "../constants/roles";
const router = express.Router();

router.post("/cart-items", 
// validateCreatecartItems(ROLES.ADMIN), 
asyncMiddleware(cartItemController.createCartItem));
router.put(
  "/cart-items/:id",
//   validateCreatecartItems(ROLES.ADMIN),
  asyncMiddleware(cartItemController.updateCartItem),
);
// router.get("/cart-items", asyncMiddleware(cartItemController.getCartItems));
// router.get("/cartItems/cartItems", asyncMiddleware(cartItemController.getAllcartItems));
router.get("/cart-items/:id", asyncMiddleware(cartItemController.getCartItemById));
router.delete(
  "/cart-items/:id",
//   validateCreatecartItems(ROLES.ADMIN),
  asyncMiddleware(cartItemController.deleteCartItem),
);
export default router;
