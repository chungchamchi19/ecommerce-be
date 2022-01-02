import { getRepository, ReturningStatementNotSupportedError } from "typeorm";
import { Pagination } from "../../types/type.pagination";
import { Order } from "../../entities/order";
import orderItemServices from "../orderItem/services";
import variantServices from "../variant/services";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { Variant } from "../../entities/variant";
import orderStatus from "../../constants/orderStatus";

const createOrder = async (orderData: Order): Promise<Order> => {
  const orderRepo = getRepository(Order);
  let newOrder = new Order();

  newOrder = orderData;
  let orderItems = orderData.orderItems;
  delete orderData.orderItems;
  let totalPrice = 0;
  let comparePrice = 0;

  for (let i = 0; i < orderItems.length; i++) {
    let variant = await variantServices.getVariantById(orderItems[i].variantId);
    console.log(variant);
    if (variant.availableNumber < orderItems[i].quantity) throw new CustomError(codes.BAD_REQUEST, "Invalid quantity");
    comparePrice += variant.comparePrice * orderItems[i].quantity;
    totalPrice += variant.price * orderItems[i].quantity;
  }
  const order = await orderRepo.insert({
    ...newOrder,
    totalPrice: totalPrice,
    totalComparePrice: comparePrice,
    shipFee: orderData.shipFee,
  });

  //Update quantity
  for (let i = 0; i < orderItems.length; i++) {
    orderItems[i].orderId = order.raw.insertId;
    let orderItem = await orderItemServices.createOrderItem(orderItems[i]);
  }
  for (let i = 0; i < orderItems.length; i++) {
    let variant = await variantServices.getVariantById(orderItems[i].variantId);

    variant.availableNumber = variant.availableNumber - orderItems[i].quantity;
    console.log(variant);
    const newVariant: Variant = {
      price: variant.price,
      comparePrice: variant.comparePrice,
      featureImageId: variant.featureImageId,
      availableNumber: variant.availableNumber,
      options: variant.options,
      productId: variant.productId,
    };
    newVariant.availableNumber = variant.availableNumber;
    await variantServices.updateVariant(variant.id, newVariant);
    // let variant = await variantServices.getVariantById(orderItems[i].variantId);

    // console.log(newVariant);
  }

  return await orderRepo.findOne({
    where: {
      id: order.raw.insertId,
    },
    relations: ["orderItems"],
  });
};

// const  checkOutAllItems = async (orderData: Order): Promise<Order> => {
//   const orderRepo = getRepository(Order);
//   let newOrder = new Order();

//   newOrder = orderData;
//   let orderItems = orderData.orderItems;
//   delete orderData.orderItems;
//   let totalPrice = 0;
//   let comparePrice = 0;
//   let obj: any = {};
//   let newOrderItems = [];

//   for (let i = 0; i < orderItems.length; i++) {
//     let variant = await variantServices.getVariantById(orderItems[i].variantId);
//     comparePrice += variant.comparePrice * orderItems[i].quantity;
//     totalPrice += variant.price * orderItems[i].quantity;
//   }
//   const order = await orderRepo.insert({
//     ...newOrder,
//     totalPrice: totalPrice,
//     subTotal: comparePrice,
//   });
//   for (let i = 0; i < orderItems.length; i++) {
//     let variant = await variantServices.getVariantById(orderItems[i].variantId);
//     orderItems[i].orderId = order.raw.insertId;
//     let orderItem = await orderItemServices.createOrderItem(orderItems[i]);
//   }

//   return await orderRepo.findOne({
//     where: {
//       id: order.raw.insertId,
//     },
//     relations: ["orderItems"],
//   });
// };

const getOrderById = async (id: number): Promise<Order> => {
  const orderRepo = getRepository(Order);
  const order = await orderRepo
    .createQueryBuilder("o")
    .leftJoinAndSelect("o.orderItems", "orderItems")
    .leftJoinAndSelect("orderItems.variant", "variant", "variant.id=orderItems.variantId")
    .leftJoinAndSelect("variant.product", "product", "variant.productId=product.id")
    .where(`o.id=${id}`)
    .getOne();
  return order;
};

const getOrders = async (params: { pagination: Pagination }, userId: number, search: string): Promise<Order[]> => {
  const orderRepo = getRepository(Order);
  let query = orderRepo
    .createQueryBuilder("o")
    .leftJoinAndSelect("o.orderItems", "orderItems")
    .leftJoinAndSelect("orderItems.variant", "variant", "variant.id=orderItems.variantId")
    .leftJoinAndSelect("variant.product", "product", "variant.productId=product.id");
  if (userId != -1) {
    query.andWhere(`o.userId=${userId}`);
  }
  if (search != "") {
    query.andWhere("(o.customerName )LIKE :name OR o.customerEmail LIKE :name", { name: `%${search}%` });
  }
  query.skip(params.pagination.offset).take(params.pagination.limit);
  return await query.getMany();
};
const getUserOrders = async (params: { pagination: Pagination }, userId: number, email: any, phone: any): Promise<Order[]> => {
  const orderRepo = getRepository(Order);
  let query = orderRepo
    .createQueryBuilder("o")
    .leftJoinAndSelect("o.orderItems", "orderItems")
    .leftJoinAndSelect("orderItems.variant", "variant", "variant.id=orderItems.variantId")
    .leftJoinAndSelect("variant.product", "product", "variant.productId=product.id")
    .where(`o.userId=${userId}`);
  if (phone && !email) {
    query.andWhere(`o.customerPhone=${phone}`);
  }
  if (email && !phone) {
    query.andWhere(`o.customerEmail=${email}`);
  }
  if (email && phone) {
    query.andWhere(`o.customerEmail=${email}`).andWhere(`o.customerPhone=${phone}`);
  }
  query.skip(params.pagination.offset).take(params.pagination.limit).orderBy("o.createdAt", "DESC");
  return query.getMany();
};

const deleteOrder = async (id: number) => {
  const orderRepo = getRepository(Order);
  await orderRepo.delete(id);
};
const userUpdateStatus = async (userId: number, status: string, id: number) => {
  const orderRepo = getRepository(Order);
  let oldOrder = await orderRepo.findOne(id, { where: { userId: userId, id: id } });

  console.log(oldOrder);
  if (oldOrder.status == orderStatus.NEW || oldOrder.status == orderStatus.COMMING) {
    if (status == orderStatus.CANCEL) {
      oldOrder.status = orderStatus.CANCEL;
    } else if (status == orderStatus.DONE) {
      oldOrder.status = orderStatus.DONE;
    } else {
      throw new CustomError(codes.BAD_REQUEST);
    }

    await orderRepo.update(oldOrder.id, oldOrder);
  }
};
const adminUpdateStatus = async (status: string, id: number) => {
  const orderRepo = getRepository(Order);

  let order = await orderRepo.findOne(id);
  console.log(order);

  if (order.status == orderStatus.COMMING) {
    order.status = orderStatus.COMMING;
  }
  await orderRepo.update(order.id, order);
  return order;
};

const orderDaos = {
  createOrder,
  getOrderById,
  getOrders,
  deleteOrder,
  getUserOrders,
  userUpdateStatus,
  adminUpdateStatus,
};

export default orderDaos;
