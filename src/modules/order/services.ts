import { Pagination } from "../../types/type.pagination";
import { Order } from "../../entities/order";
import orderDaos from "./daos";
import configs from "../../configs";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { User } from "../../entities/user";
import user from "../auth/daos/user";

const createOrder = async (orderData: Order) => {
  const newOrder = await orderDaos.createOrder(orderData);
  return newOrder;
};

const getOrders = async (params: { pagination: Pagination },search: string,userId: number): Promise<Order[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  console.log(userId,search);
  let listOrder = await orderDaos.getOrders({ pagination },userId,search);

  return listOrder;
};
const getUserOrders =async (params: { pagination: Pagination },user: User): Promise<Order[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  let listOrder = await orderDaos.getUserOrders({ pagination },user.id);

  return listOrder;
};

const getOrderById = async (id: number): Promise<Order> => {
  const findOrder = await orderDaos.getOrderById(id);
  if (!findOrder) {
    throw new CustomError(codes.NOT_FOUND, "order not found!");
  }

  return findOrder;
};
// const getOrderByUserId = async (userId: number): Promise<Order[]> => {
//   const findOrder = await orderDaos.getOrderByUserId(userId);
//   return findOrder;
// };

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
  getUserOrders
};

export default orderServices;
