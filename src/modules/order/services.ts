import { Pagination } from "../../types/type.pagination";
import { Order } from "../../entities/order";
import orderDaos from "./daos";
import configs from "../../configs";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";

const createOrder = async (orderData: Order) => {
  const newOrder = await orderDaos.createOrder(orderData);
  return newOrder;
};

const getOrders = async (params: { pagination: Pagination }): Promise<Order[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  let listorder = await orderDaos.getOrders({ pagination });

  return listorder;
};

const getOrderById = async (id: number): Promise<Order> => {
  const findOrder = await orderDaos.getOrderById(id);
  if (!findOrder) {
    throw new CustomError(codes.NOT_FOUND, "order not found!");
  }

  return findOrder;
};
const getOrderByUserId = async (userId: number): Promise<Order[]> => {
  const findOrder = await orderDaos.getOrderByUserId(userId);
  return findOrder;
};



const deleteOrder = async (id: number) => {
  const findorder = await getOrderById(id);
  orderDaos.deleteOrder(id);
  return findorder;
};


const orderServices = {
  createOrder,
  getOrders,
  getOrderByUserId,
  getOrderById,
  deleteOrder
};

export default orderServices;
