import { Pagination } from "../../types/type.pagination";
import { OrderItem } from "../../entities/orderItem";
import orderItemDaos from "./daos";
import configs from "../../configs";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { Media } from "../../entities/media";
import variantServices from "../variant/services";

const createOrderItem = async (orderItemData: OrderItem) => {
  const neworderItem = await orderItemDaos.createOrderItem(orderItemData);
};

const getOrderItems = async (params: { pagination: Pagination }): Promise<OrderItem[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  let listorderItem = await orderItemDaos.getOrderItems({ pagination });
  return listorderItem;
};

const getOrderItemById = async (id: number): Promise<OrderItem> => {
  const findorderItem = await orderItemDaos.getOrderItemById(id);
  if (!findorderItem) {
    throw new CustomError(codes.NOT_FOUND, "orderItem not found!");
  }
  return findorderItem;
};
const deleteorderItem = async (id: number) => {
  const findorderItem = await getOrderItemById(id);
  orderItemDaos.deleteOrderItem(id);
  return findorderItem;
};

const checkOrderItem = (orderId: number, variantId: number) => {

};

const orderItemServices = {
  createOrderItem,
  getOrderItems,
  deleteorderItem,
  getOrderItemById,
};

export default orderItemServices;
