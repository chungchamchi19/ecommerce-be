import express from "express";
import asyncMiddleware from "../middlewares/async";
import cartController from "../modules/cart/controllers";
import ROLES from "../constants/roles";
import { validateCreateCarts } from "../validations/cart";
const router = express.Router();

router.post("/carts",
//  validateCreateCarts(ROLES.User), 
 asyncMiddleware(cartController.createCart));
router.get(
  "/carts/getCartByUserId/:userId",
  // validateCreateCarts(ROLES.User),
  asyncMiddleware(cartController.getCartByUserId),
);
router.put("/carts/:id", asyncMiddleware(cartController));
// /router.get("/carts/articles", asyncMiddleware(cartController.getAllArticles));
router.get("/carts/:id", asyncMiddleware(cartController.getCartById));

export default router;
