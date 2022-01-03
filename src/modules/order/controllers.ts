import { Order } from "../../entities/order";
import { Request, Response } from "express";
import orderServices from "./services";
import shopInforService from "../shopInfor/services";
import user from "../auth/daos/user";
import orderStatus from "../../constants/orderStatus";
import { stat } from "fs";

const createOrder = async (req: Request, res: Response) => {
  const { customerAddress, customerEmail, customerName, customerPhone, paymentMethod, deliveryMethod, orderItems, shipFee, comment } = req.body;

  const userId = req.user.id;
  const orderData: Order = {
    userId,
    customerAddress,
    customerEmail,
    customerName,
    customerPhone,
    paymentMethod,
    deliveryMethod,
    status: orderStatus.NEW,
    orderItems,
    shipFee,
    comment,
  };

  const newOrder = await orderServices.createOrder(orderData, userId);
  res.status(200).json({
    status: "success",
    result: newOrder,
  });
};
// const adminUpdateOrder = async (req: Request, res: Response) => {
//   const { customerAddress, detailCustomerAddress, customerEmail, customerName, customerPhone, paymentMethod, status, deliveryMethod, orderItems, shipFee, comment } = req.body;

//   const userId = req.user.id;
//   const orderData: Order = {
//     userId,
//     customerAddress,
//     customerEmail,
//     customerName,
//     customerPhone,
//     paymentMethod,
//     status,
//     deliveryMethod,
//     orderItems,
//     shipFee,
//     comment,
//   };

//   const newOrder = await orderServices.createOrder(orderData);
//   res.status(200).json({
//     status: "success",
//     result: newOrder,
//   });
// };

//admin order
const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await orderServices.getOrderById(Number(id));
  let returnOrder = await orderServices.returnOrders(order);

  res.status(200).json({
    status: "success",
    result: returnOrder,
  });
};
//admin
// const getOrderByUserId = async (req: Request, res: Response) => {
//     const { userId } = req.params;

//     const orders = await orderServices.getOrderByUserId(Number(userId));
//     res.status(200).json({
//         status: "success",
//         result: orders,
//     });
// };
//admin
const adminGetOrders = async (req: Request, res: Response) => {
  console.log("???? DAAAAAAAAAAAAA");
  let { limit, offset, userId, search } = req.query;

  search = search ? search : "";
  userId = userId ? userId : "-1";

  const orders = await orderServices.getOrders({ pagination: { limit: Number(limit), offset: Number(offset) } }, String(search), Number(userId));
  console.log(orders);
  const returnOrderList: any = [];
  for (let i = 0; i < orders[0].length; i++) {
    let order = await orderServices.returnOrders(orders[0][i]);
    returnOrderList.push(order);
  }

  res.status(200).json({
    status: "success",
    result: returnOrderList,
    total: orders[1],
  });
};

//adminOrder
const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await orderServices.deleteOrder(Number(id));
  res.status(200).json({
    status: "success",
    result: order,
  });
};

//adminOrder
const adminUpdateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(status);
  const order = await orderServices.adminUpdateStatus(status, Number(id));
  res.status(200).json({
    status: "success",
    result: order,
  });
};
const userUpdateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { status } = req.body;
  const order = await orderServices.userUpdateStatus(userId, status, Number(id));
  res.status(200).json({
    status: "success",
    result: order,
  });
};

//User order
const userGetOrders = async (req: Request, res: Response) => {
  // limit, offset, userId, search
  console.log("???? DAAAAAAAAAAAAA");

  const { limit, offset, email, phone } = req.query;
  // console.log(email)
  const userId = req.user.id;
  const params: any = {
    email: email as string,
    phone: phone as string,
  };
  // console.log(params)
  const orders = await orderServices.getUserOrders({ pagination: { limit: Number(limit), offset: Number(offset) } }, userId, params.email, params.phone);
  console.log(orders);
  const returnOrderList: any = [];
  for (let i = 0; i < orders[0].length; i++) {
    let order = await orderServices.returnOrders(orders[0][i]);
    returnOrderList.push(order);
  }

  res.status(200).json({
    status: "success",
    result: returnOrderList,
    total: orders[1],
  });
};

const orderControllers = {
  createOrder,
  getOrderById,
  deleteOrder,
  userGetOrders,
  adminGetOrders,
  adminUpdateStatus,
  userUpdateStatus,
};

export default orderControllers;
