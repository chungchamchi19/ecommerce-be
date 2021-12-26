import { Pagination } from "../../types/type.pagination";
import { Order } from "../../entities/order";
import orderDaos from "./daos";
import configs from "../../configs";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { User } from "../../entities/user";
import user from "../auth/daos/user";
import  shopInforService  from "../shopInfor/services";
const createOrder = async (orderData: Order) => {
  const newOrder = await orderDaos.createOrder(orderData);
  // console.log(newOrder);
  return newOrder;
};

// const checkoutAllItems = async (orderData: Order) => {
//   const newOrder = await orderDaos.checkOutAllItems(orderData);
//   return newOrder;
// };

const getOrders = async (params: { pagination: Pagination }, search: string, userId: number): Promise<Order[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  let listOrder = await orderDaos.getOrders({ pagination }, userId, search);

  return listOrder;
};

const returnOrders = async (order: any) => {
  // let totalPrice = 0;
  // let totalComparePrice = 0;
  let totalCountItems = 0;
  for (let i = 0; i < order?.orderItems?.length; i++) {
    order.orderItems[i]["linePrice"] = order.orderItems[i].variant.price * order.orderItems[i].quantity;
    order.orderItems[i]["lineComparePrice"] = order.orderItems[i].variant.comparePrice * order.orderItems[i].quantity;
    totalCountItems += order.orderItems[i].quantity;
  }
  order["totalCountItems"] = totalCountItems;
  order["finalPrice"] = order.totalPrice + order.shipFee;

  return order;
};

const getUserOrders = async (params: { pagination: Pagination }, user: User): Promise<Order[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  let listOrder = await orderDaos.getUserOrders({ pagination }, user.id);
  return listOrder;
};

const getOrderById = async (id: number): Promise<Order> => {
  const findOrder = await orderDaos.getOrderById(id);
  if (!findOrder) {
    throw new CustomError(codes.NOT_FOUND, "order not found!");
  }

  return findOrder;
};

const deleteOrder = async (id: number) => {
  const findOrder = await getOrderById(id);
  orderDaos.deleteOrder(id);
  return findOrder;
};

const orderServices = {
  createOrder,
  getOrders,
  // getOrderByUserId,
  getOrderById,
  deleteOrder,
  getUserOrders,
  returnOrders
  // checkoutAllItems
};

export default orderServices;
