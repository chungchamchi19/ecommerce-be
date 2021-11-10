// import { validateCreatecartItems } from "./../validations/articles";
import express from "express";
import asyncMiddleware from "../middlewares/async";
import cartItemController from "../modules/cartItem/controllers";
// import ROLES from "../constants/roles";
const router = express.Router();

router.post("/cartItems", 
// validateCreatecartItems(ROLES.ADMIN), 
asyncMiddleware(cartItemController.createCartItem));
router.put(
  "/cartItems/:id",
//   validateCreatecartItems(ROLES.ADMIN),
  asyncMiddleware(cartItemController.updateCartItem),
);
router.get("/cartItems", asyncMiddleware(cartItemController.getCartItems));
// router.get("/cartItems/cartItems", asyncMiddleware(cartItemController.getAllcartItems));
router.get("/cartItems/:id", asyncMiddleware(cartItemController.getCartItemById));
router.delete(
  "/cartItems/:id",
//   validateCreatecartItems(ROLES.ADMIN),
  asyncMiddleware(cartItemController.deleteCartItem),
);
export default router;
