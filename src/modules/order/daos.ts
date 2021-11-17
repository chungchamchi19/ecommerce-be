import { getRepository } from "typeorm";
import { Pagination } from "../../types/type.pagination";
import { Order } from "../../entities/order";
import orderItemServices from "../orderItem/services";
import varriantServices from "../varriant/services";
import variantServices from "../varriant/services";
import orderServices from "./services";

const createOrder = async (orderData: Order): Promise<Order> => {
  const orderRepo = getRepository(Order);
  let newOrder = new Order();

  newOrder = orderData;
  let orderItems = orderData.orderItems;
  delete orderData.orderItems;
  let totalPrice = 0;
  let comparePrice = 0;
  let obj: any = {};
  let newOrderItems = [];

  for (let i = 0; i < orderItems.length; i++) {
    let variant = await variantServices.getVariantById(orderItems[i].variantId);
    comparePrice += variant.comparePrice * orderItems[i].quantity;
    totalPrice += variant.price * orderItems[i].quantity;
  }
  const order = await orderRepo.insert({
    ...newOrder,
    totalPrice: totalPrice,
    subTotal: comparePrice,
  });
  for (let i = 0; i < orderItems.length; i++) {
    let variant = await variantServices.getVariantById(orderItems[i].variantId);
    orderItems[i].orderId = order.raw.insertId;
    let orderItem = await orderItemServices.createOrderItem(orderItems[i]);
  }

  return await orderRepo.findOne({
    where: {
      id: order.raw.insertId,
    },
    relations: ["orderItems"],
  });
};

const getOrderById = async (id: number): Promise<Order> => {
  const orderRepo = getRepository(Order);
  const order = await orderRepo
    .createQueryBuilder("c")
    .leftJoinAndSelect("c.orderItems", "orderItems")
    .leftJoinAndSelect("orderItems.variant", "variant", "variant.id=orderItems.variantId")
    .leftJoinAndSelect("variant.product", "product", "variant.productId=product.id")

    // .leftJoinAndSelect("ci.featureImage", "fm", "fm.targetType='product'")
    .where(`c.id=${id}`)
    .getOne();
  return order;
};

// const getOrderByUserId = async (userId: number): Promise<Order[]> => {
//   const orderRepo = getRepository(Order);
//   const order = await orderRepo
//     .createQueryBuilder("o")
//     .leftJoinAndSelect("o.orderItems", "orderItems")
//     .leftJoinAndSelect("orderItems.variant", "variant", "variant.id=orderItems.variantId")
//     .leftJoinAndSelect("variant.product", "product", "variant.productId=product.id")
//     .where(`o.userId=${userId}`)
//     .getMany();
//   return order;
// };
const getOrders = async (params: { pagination: Pagination }, userId: number, search: string): Promise<Order[]> => {
  const orderRepo = getRepository(Order);
  let query = orderRepo
    .createQueryBuilder("o")
    .leftJoinAndSelect("o.orderItems", "orderItems")
    .leftJoinAndSelect("orderItems.variant", "variant", "variant.id=orderItems.variantId")
    .leftJoinAndSelect("variant.product", "product", "variant.productId=product.id");
    console.log("??????",userId);
  if (userId != -1) {
    query.where(`o.userId=${userId}`);
  }
  if(search != '') {
    query.where("(o.customerName )LIKE :name OR o.customerEmail LIKE :name", { name:`%${search}%` })
  }
  query.skip(params.pagination.offset).take(params.pagination.limit);
//  console.log(await query.getMany())
  return await query.getMany();
};
const getUserOrders = async (params: { pagination: Pagination }, userId: number): Promise<Order[]> => {
  const orderRepo = getRepository(Order);
  return await orderRepo
    .createQueryBuilder("o")
    .leftJoinAndSelect("o.orderItems", "orderItems")
    .leftJoinAndSelect("orderItems.variant", "variant", "variant.id=orderItems.variantId")
    .leftJoinAndSelect("variant.product", "product", "variant.productId=product.id")
    .where(`o.userId=${userId}`)
    .skip(params.pagination.offset)
    .take(params.pagination.limit)
    .getMany();
};
// const getOrderById = async (id: number): Promise<Order> => {
//   const orderRepo = getRepository(Order);
//   const order = await orderRepo
//     .createQueryBuilder("c")
//     .leftJoinAndSelect("c.orderItems", "orderItems")
//     .leftJoinAndSelect("orderItems.variant", "variant", "variant.id=orderItems.variantId")
//     .leftJoinAndSelect("variant.product", "product", "variant.productId=product.id")

//     // .leftJoinAndSelect("ci.featureImage", "fm", "fm.targetType='product'")
//     .where(`c.id=${id}`)
//     .getOne();
//   return order;
// };

const deleteOrder = async (id: number) => {
  const orderRepo = getRepository(Order);
  await orderRepo.delete(id);
};

const orderDaos = {
  createOrder,
  getOrderById,
  getOrders,
  deleteOrder,
  // getOrderByUserId,
  getUserOrders,
};

export default orderDaos;
