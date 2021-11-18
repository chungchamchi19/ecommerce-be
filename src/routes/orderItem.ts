import express from "express";
import asyncMiddleware from "../middlewares/async";
import orderItemControllers from "../modules/orderItem/controllers";
const router = express.Router();
router.post("/orderItems", asyncMiddleware(orderItemControllers.createOrderItem));
router.get("/orderItems", asyncMiddleware(orderItemControllers.getOrderItems));
router.get("/orderItems/:orderItemId", asyncMiddleware(orderItemControllers.getOrderItemById));

export default router;
