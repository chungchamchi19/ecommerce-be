import { Order } from "../../entities/order";
import { Request, Response } from "express";
import orderServices from "./services";

const createOrder = async (req: Request, res: Response) => {
    const { userId,customerAddress,customerEmail,customerName,
        customerPhone, paymentMethod,status,deliveryMethod,orderItems } = req.body;
    
    const orderData: Order = {
        userId,
        customerAddress,
        customerEmail,
        customerName,
        customerPhone,
        paymentMethod,
        status,
        deliveryMethod,
        orderItems
    };
    const newOrder = await orderServices.createOrder(orderData);
    res.status(200).json({
        status: "success",
        result: newOrder,
    });
};

const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await orderServices.getOrderById(Number(id));
    res.status(200).json({
        status: "success",
        result: order,
    });
};

const getOrderByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;

    const orders = await orderServices.getOrderByUserId(Number(userId));
    res.status(200).json({
        status: "success",
        result: orders,
    });
};

const getOrders = async (req: Request, res: Response) => {
    const { limit, offset } = req.query;
    const orders = await orderServices.getOrders({ pagination: { limit: Number(limit), offset: Number(offset) } });

    res.status(200).json({
        status: "success",
        result: orders,
    });
};


const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await orderServices.deleteOrder(Number(id));
    res.status(200).json({
        status: "success",
        result: order,
    });
};

const orderControllers = {
    createOrder,
    getOrderByUserId,
    getOrderById,
    deleteOrder,
    getOrders
};

export default orderControllers;
