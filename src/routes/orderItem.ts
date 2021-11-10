// import { validateCreatecartItems } from "./../validations/articles";
import express from "express";
import asyncMiddleware from "../middlewares/async";
import orderItemControllers from "../modules/orderItem/controllers";
// import ROLES from "../constants/roles";
const router = express.Router();

router.post("/orderItems", 
// validateCreateorderItems(ROLES.ADMIN), 
asyncMiddleware(orderItemControllers.createOrderItem));
// router.put(
//   "/orderItems/:id",
// //   validateCreateorderItems(ROLES.ADMIN),
//   asyncMiddleware(orderItemController.updateOrderItem),
// );
router.get("/orderItems", asyncMiddleware(orderItemControllers.getOrderItems));
// router.get("/orderItems/orderItems", asyncMiddleware(cartItemController.getAllcartItems));
router.get("/orderItems/:orderItemId", asyncMiddleware(orderItemControllers.getOrderItemById));

export default router;
