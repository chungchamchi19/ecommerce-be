import { OrderItem } from "../../entities/orderItem";
import { Request, Response } from "express";
import orderItemServices from "./services";
import variantServices from "../variant/services";

const createOrderItem = async (req: Request, res: Response) => {
  const { orderId, variantId, quantity } = req.body;

  const orderData: OrderItem = {
    orderId,
    variantId,
    quantity,
  };
  const newOrderItem = await orderItemServices.createOrderItem(orderData);
  res.status(200).json({
    status: "success",
    result: newOrderItem,
  });
};

const getOrderItemById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderItem = await orderItemServices.getOrderItemById(Number(id));
  res.status(200).json({
    status: "success",
    result: orderItem,
  });
};

const getOrderItems = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;
  const orderItems = await orderItemServices.getOrderItems({
    pagination: { limit: Number(limit), offset: Number(offset) },
  });
  res.status(200).json({
    status: "success",
    result: orderItems,
  });
};

const deleteOrderItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderItem = await orderItemServices.deleteorderItem(Number(id));
  res.status(200).json({
    status: "success",
    result: orderItem,
  });
};

const orderItemControllers = {
  createOrderItem,
  getOrderItemById,
  getOrderItems,
  deleteOrderItem,
};

export default orderItemControllers;
