import { Pagination } from "../../types/type.pagination";
import { OrderItem } from "../../entities/orderItem";
// import { convertToSlug } from "../../utils/convertToSlug";
import orderItemDaos from "./daos";
import configs from "../../configs";
import mediaServices from "../media/services";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { Media } from "../../entities/media";
import variantServices from '../varriant/services'

const createOrderItem = async (orderItemData: OrderItem) => {
    //   if (orderItemData.orderId && orderItemData.variantId) {
    //     checkorderItem(orderItemData.orderId,orderItemData.variantId);
    //   }
    
    // create new orderItem
    const neworderItem = await orderItemDaos.createOrderItem(orderItemData);

};

const getOrderItems = async (params: { pagination: Pagination }): Promise<OrderItem[]> => {
    const pagination = {
        limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
        offset: params.pagination.offset || 0,
    };
    let listorderItem = await orderItemDaos.getorderItems({ pagination });
    // listorderItem = listorderItem.map((orderItem: orderItem) => {
    //   return {
    //     ...orderItem,
    //   };
    // });
    return listorderItem;
};

const getOrderItemById = async (id: number): Promise<OrderItem> => {
    const findorderItem = await orderItemDaos.getOrderItemById(id);
    if (!findorderItem) {
        throw new CustomError(codes.NOT_FOUND, "orderItem not found!");
    }
    // const media = formatMedia(findorderItem.featureImage, findorderItem.media);
    // return {
    //   ...findorderItem,
    //   media,
    // };
    return findorderItem;
};

const updateOrderItem = async (id: number, data: OrderItem): Promise<OrderItem> => {
    const findorderItem = await getOrderItemById(id);
    if (!findorderItem) {
        throw new CustomError(codes.NOT_FOUND, "orderItem not found!");
    }
    delete data.id;
    await orderItemDaos.updateorderItem(id, data);
    return await getOrderItemById(id);
};

const deleteorderItem = async (id: number) => {
    const findorderItem = await getOrderItemById(id);
    orderItemDaos.deleteorderItem(id);
    return findorderItem;
};



const checkorderItem = (orderId: number, variantId: number) => {
    // if (!media.find((item) => item.id === featureImageId)) {
    //   throw new CustomError(codes.BAD_REQUEST, "Feature image id should have in media list!");
    // }
};

const orderItemServices = {
    createOrderItem,
    getOrderItems,
    deleteorderItem,
    getOrderItemById,
};

export default orderItemServices;
