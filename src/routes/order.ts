// import { validateCreateArticles } from "./../validations/articles";
import express from "express";
import asyncMiddleware from "../middlewares/async";
import orderController from "../modules/order/controllers";
import { validateCreateOrders } from "../validations/orders";
import ROLES from "../constants/roles";
const router = express.Router();

router.get("/orders",
 validateCreateOrders(ROLES.ADMIN), 
 asyncMiddleware(orderController.getOrders));
router.post("/orders",
 asyncMiddleware(orderController.createOrder));
router.get(
  "/users/:userId/orders",
  asyncMiddleware(orderController.getOrderByUserId),
);
router.get("/orders/:id", asyncMiddleware(orderController.getOrderById));

export default router;
