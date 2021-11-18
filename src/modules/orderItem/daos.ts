import { OrderItem } from "./../../entities/orderItem";
import { getRepository } from "typeorm";
import { Pagination } from "../../types/type.pagination";
import { Order } from "../../entities/order";
import variantServices from "../variant/services"

const createOrderItem = async (orderItemData: OrderItem): Promise<OrderItem> => {

    const variant = await variantServices.getVariantById(orderItemData.variantId);
    const orderItemRepo = getRepository(OrderItem);
    let newOrderItem = new OrderItem();
    newOrderItem = orderItemData;
    newOrderItem.price = variant.price;
    newOrderItem.comparePrice =variant.comparePrice; 
    const orderItem = await orderItemRepo.save(newOrderItem);
    return orderItem;
};

const getOrderItemById = async (id: number): Promise<OrderItem> => {
    const orderItemRepo = getRepository(OrderItem);
    const orderItem = await orderItemRepo
        .createQueryBuilder("ci")
        .leftJoinAndSelect("ci.variant", "variant")
        // .leftJoinAndSelect("ci.featureImage", "fm", "fm.targetType='product'")
        .where(`ci.id=${id}`)
        .getOne();
    return orderItem;
};

const getOrderItems = async (params: { pagination: Pagination }): Promise<OrderItem[]> => {
    const orderItemRepo = getRepository(OrderItem);
    return await orderItemRepo
        .createQueryBuilder("ci")
        .leftJoinAndSelect("ci.variant", "variant")
        .skip(params.pagination.offset)
        .take(params.pagination.limit)
        .getMany();
};


// const updateOrderItem = async (id: number, orderData: OrderItem): Promise<OrderItem> => {
//     const orderItemRepo = getRepository(OrderItem);
//     const newUpdate = await orderItemRepo.update(id, orderData);
//     return newUpdate.raw;
// };

const deleteOrderItem = async (id: number) => {
    const orderItemRepo = getRepository(OrderItem);
    await orderItemRepo.delete(id);
};

const orderItemDaos = {
    createOrderItem,
    getOrderItemById,
    getOrderItems,
    // updateOrderItem,
    deleteOrderItem,
};

export default orderItemDaos;
