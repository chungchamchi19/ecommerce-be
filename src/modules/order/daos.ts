import { getRepository, ReturningStatementNotSupportedError } from "typeorm";
import { Pagination } from "../../types/type.pagination";
import { Order } from "../../entities/order";
import orderItemServices from "../orderItem/services";
import variantServices from "../variant/services";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { Variant } from "../../entities/variant";
import orderStatus from "../../constants/orderStatus";
import { stat } from "fs";
import cartItemServices from "../cartItem/services";

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
    if (variant.availableNumber < orderItems[i].quantity) throw new CustomError(codes.BAD_REQUEST, `Number of item has name ${variant.publicTitle} is not enough`);
    comparePrice += variant.comparePrice * orderItems[i].quantity;
    totalPrice += variant.price * orderItems[i].quantity;
  }
  const createOrder = await orderRepo.insert({
    ...newOrder,
    totalPrice: totalPrice,
    totalComparePrice: comparePrice,
    shipFee: orderData.shipFee,
  });
  const code = "LOCVUNG_" + createOrder.raw.insertId;
  const order = await orderRepo.save({
    id: createOrder.raw.insertId,
    code: code,
  });
  //Update quantity
  for (let i = 0; i < orderItems.length; i++) {
    orderItems[i].orderId = createOrder.raw.insertId;
    let orderItem = await orderItemServices.createOrderItem(orderItems[i]);
  }
  for (let i = 0; i < orderItems.length; i++) {
    let variant = await variantServices.getVariantById(orderItems[i].variantId);

    variant.availableNumber = variant.availableNumber - orderItems[i].quantity;
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
  }

  //Delete items in cart
  for (let i = 0; i < orderItems.length; i++) {
    cartItemServices.deleteCartItemByItemId(orderData.userId, orderItems[i].variantId);
  }

  return await orderRepo.findOne({
    where: {
      id: createOrder.raw.insertId,
    },
    relations: ["orderItems"],
  });
};

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

const getOrders = async (params: { pagination: Pagination }, userId: number, search: string, status: string): Promise<[Order[], number]> => {
  
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
  if (status != 'undefined') {
    query.andWhere("o.status = :status", { status: `${status}` });
  }
  query.orderBy('o.status','DESC').addOrderBy('o.createdAt','DESC');
  query.skip(params.pagination.offset).take(params.pagination.limit);
  return await query.getManyAndCount();
};
const getUserOrders = async (params: { pagination: Pagination }, userId: number, email: string, phone: string,status: string): Promise<[Order[], number]> => {
  const orderRepo = getRepository(Order);
  let query = orderRepo
    .createQueryBuilder("o")
    .leftJoinAndSelect("o.orderItems", "orderItems")
    .leftJoinAndSelect("orderItems.variant", "variant", "variant.id=orderItems.variantId")
    .leftJoinAndSelect("variant.product", "product", "variant.productId=product.id")
    .where(`(o.userId=${userId})`);
  if (phone && !email) {
    query.andWhere("(o.customerPhone=:phone)", { phone: phone });
  }
  if (email && !phone) {
    query.andWhere("(o.customerEmail=:email)", { email: email });
  }
  if (email && phone) {
    query.andWhere("((o.customerEmail=:email) AND (o.customerPhone=:phone))", { email: email, phone: phone });
  }
  if (status) {
    query.andWhere("o.status = :status", { status: `${status}` });
  }
  query.orderBy('o.status','DESC').addOrderBy('o.createdAt','DESC');
  
  query.skip(params.pagination.offset).take(params.pagination.limit);
  return query.getManyAndCount();
};

const deleteOrder = async (id: number) => {
  const orderRepo = getRepository(Order);
  await orderRepo.delete(id);
};
const userUpdateStatus = async (userId: number, status: string, id: number) => {
  const orderRepo = getRepository(Order);
  let oldOrder = await orderRepo.findOne(id, { where: { userId: userId } });

  if (status == orderStatus.CANCEL) {
    if (oldOrder.status == orderStatus.NEW || oldOrder.status == orderStatus.COMING) {
      await orderRepo.save({ id: oldOrder.id, ...oldOrder, status: status });
    } else {
      throw new CustomError(codes.BAD_REQUEST);
    }
  } else if (status == orderStatus.DONE) {
    if (oldOrder.status == orderStatus.NEW || oldOrder.status == orderStatus.COMING) {
      await orderRepo.save({ id: oldOrder.id, ...oldOrder, status: status });
    } else {
      throw new CustomError(codes.BAD_REQUEST);
    }
  } else {
    throw new CustomError(codes.BAD_REQUEST);
  }

  return getOrderById(id);
};
const adminUpdateStatus = async (status: string, id: number) => {
  const orderRepo = getRepository(Order);

  let order = await orderRepo.findOne(id);
  if (!order) throw new CustomError(codes.BAD_REQUEST);
  if (order.status == orderStatus.NEW && status == orderStatus.COMING) {
    await orderRepo.save({ id: order.id, ...order, status: status });
  } else throw new CustomError(codes.BAD_REQUEST);
  return getOrderById(id);
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
