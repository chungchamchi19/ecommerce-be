import { Order } from "../../entities/order";
import { Request, Response } from "express";
import orderServices from "./services";
import shopInforService from "../shopInfor/services";
import user from "../auth/daos/user";
import orderStatus from "../../constants/orderStatus";

const createOrder = async (req: Request, res: Response) => {
  const { customerAddress, detailCustomerAddress, customerEmail, customerName, customerPhone, paymentMethod, deliveryMethod, orderItems, shipFee, comment } = req.body;

  const userId = req.user.id;
  const orderData: Order = {
    userId,
    customerAddress,
    detailCustomerAddress,
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

  const newOrder = await orderServices.createOrder(orderData);
  res.status(200).json({
    status: "success",
    result: newOrder,
  });
};
const adminUpdateOrder = async (req: Request, res: Response) => {
  const { customerAddress, detailCustomerAddress, customerEmail, customerName, customerPhone, paymentMethod, status, deliveryMethod, orderItems, shipFee, comment } = req.body;

  const userId = req.user.id;
  const orderData: Order = {
    userId,
    customerAddress,
    detailCustomerAddress,
    customerEmail,
    customerName,
    customerPhone,
    paymentMethod,
    status,
    deliveryMethod,
    orderItems,
    shipFee,
    comment,
  };

  const newOrder = await orderServices.createOrder(orderData);
  res.status(200).json({
    status: "success",
    result: newOrder,
  });
};
// const userUpdateOrder = async (req: Request, res: Response) => {
//   const { status,orderId } = req.body;
//   const newOrder = await orderServices.userUpdateOrder(user,id,status);
//   res.status(200).json({
//     status: "success",
//     result: newOrder,
//   });
// };


// const checkOutAllItemInCart = async (req: Request, res: Response) => {
//   const { customerAddress,detailCustomerAddress, customerEmail, customerName, customerPhone, paymentMethod, status, deliveryMethod, orderItems, shipFee,comment } = req.body;

//   const userId =req.user.id;
//   const orderData: Order = {
//     userId,
//     customerAddress,
//     detailCustomerAddress,
//     customerEmail,
//     customerName,
//     customerPhone,
//     paymentMethod,
//     status,
//     deliveryMethod,
//     shipFee,
//     comment
//   };
//   const newOrder = await orderServices.checkoutAllItems(orderData);
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
  let { limit, offset, userId, search } = req.query;
  search = search ? search : "";
  userId = userId ? userId : "-1";

  const orders = await orderServices.getOrders({ pagination: { limit: Number(limit), offset: Number(offset) } }, String(search), Number(userId));
  const returnOrderList: any = [];
  for(let i =0 ;i< orders.length;i++) {
    let order = await orderServices.returnOrders(orders[i]);
    returnOrderList.push(order);
  }

  res.status(200).json({
    status: "success",
    result: returnOrderList,
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
  const {status } =  req.body
  const order = await orderServices.adminUpdateStatus(status,Number(id));
  res.status(200).json({
    status: "success",
    result: order,
  });
};
const userUpdateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const {status} = req.body
  const order = await orderServices.userUpdateStatus(userId,status,Number(id));
  res.status(200).json({
    status: "success",
    result: order,
  });
};

//User order
const userGetOrders = async (req: Request, res: Response) => {
  // limit, offset, userId, search
  const { limit, offset,email, phone } = req.query;
  const userId = req.user.id;
  const orders = await orderServices.getUserOrders({ pagination: { limit: Number(limit), offset: Number(offset) } }, userId, email, phone);
  const returnOrderList: any = [];
  for(let i =0 ;i< orders.length;i++) {
    let order = await orderServices.returnOrders(orders[i]);
    returnOrderList.push(order);
  }

  res.status(200).json({
    status: "success",
    result: returnOrderList,
  });
};

const orderControllers = {
  createOrder,
  getOrderById,
  deleteOrder,
  userGetOrders,
  adminGetOrders,
  adminUpdateStatus,
  userUpdateStatus
};

export default orderControllers;
