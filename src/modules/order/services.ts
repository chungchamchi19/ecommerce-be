import { Pagination } from "../../types/type.pagination";
import { Order } from "../../entities/order";
import orderDaos from "./daos";
import configs from "../../configs";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { User } from "../../entities/user";
import user from "../auth/daos/user";
import shopInforService from "../shopInfor/services";
import cartServices from "../cart/services";
const createOrder = async (orderData: Order, userId: number) => {
  const newOrder = await orderDaos.createOrder(orderData);
  // console.log(newOrder);
  return newOrder;
};

// const checkoutAllItems = async (orderData: Order) => {
//   const newOrder = await orderDaos.checkOutAllItems(orderData);
//   return newOrder;
// };

const getOrders = async (params: { pagination: Pagination }, search: string, userId: number): Promise<[Order[], number]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  let [listOrder, total] = await orderDaos.getOrders({ pagination }, userId, search);
  console.log(listOrder, total);
  return [listOrder, total];
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
  for (let i = 0; i < order?.orderItems?.length; i++) {
    const newVariant = await cartServices.getVariantPublicTitle(order.orderItems[i].variant.id);
    order.orderItems[i].variant["publicTitle"] = newVariant.publicTitle;
  }
  order["totalCountItems"] = totalCountItems;
  order["finalPrice"] = order.totalPrice + order.shipFee;

  return order;
};

const getUserOrders = async (params: { pagination: Pagination }, userId: number, email: string, phone: string): Promise<[Order[], number]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  let [listOrder, total] = await orderDaos.getUserOrders({ pagination }, userId, email, phone);
  console.log(listOrder, total);
  return [listOrder, total];
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
const adminUpdateStatus = async (status: string, id: number) => {
  const findOrder = await getOrderById(id);
  await orderDaos.adminUpdateStatus(status, id);
  return await getOrderById(id);
};

const userUpdateStatus = async (userId: number, status: string, id: number) => {
  const findOrder = await getOrderById(id);
  await orderDaos.userUpdateStatus(userId, status, id);
  const updateOrder = await getOrderById(id);
  return updateOrder;
};

const orderServices = {
  createOrder,
  getOrders,
  // getOrderByUserId,
  getOrderById,
  deleteOrder,
  getUserOrders,
  returnOrders,
  // checkoutAllItems
  adminUpdateStatus,
  userUpdateStatus,
};

export default orderServices;
