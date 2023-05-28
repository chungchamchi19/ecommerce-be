import { appDataSource } from "./../../database/connectDB";
import { CartItem } from "../../entities/cartItem";
import { Pagination } from "../../types/type.pagination";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";

const createCartItem = async (cartItemData: CartItem): Promise<CartItem> => {
  const cartItemRepo = appDataSource.getRepository(CartItem);
  const newCartItem = cartItemRepo.create(cartItemData);
  const cartItem = await cartItemRepo.save(newCartItem);
  return cartItem;
};

const getCartItemById = async (id: number): Promise<CartItem> => {
  const cartItemRepo = appDataSource.getRepository(CartItem);
  const cartItem = await cartItemRepo
    .createQueryBuilder("ci")
    .leftJoinAndSelect("ci.variant", "variant")
    .leftJoinAndSelect("variant.product", "product", "variant.productId=product.id")
    // .leftJoinAndSelect("ci.featureImage", "fm", "fm.targetType='product'")
    .where(`ci.id=${id}`)
    .getOne();
  return cartItem;
};

const getCartItems = async (params: { pagination: Pagination }): Promise<CartItem[]> => {
  const cartItemRepo = appDataSource.getRepository(CartItem);
  return await cartItemRepo
    .createQueryBuilder("ci")
    .leftJoinAndSelect("ci.variant", "variant")
    .leftJoinAndSelect("variant.product", "product", "variant.productId=product.id")
    .skip(params.pagination.offset)
    .take(params.pagination.limit)
    .getMany();
};

const updateCartItem = async (id: number, cartData: CartItem): Promise<CartItem> => {
  const cartItemRepo = appDataSource.getRepository(CartItem);
  const newUpdate = await cartItemRepo.update(id, cartData);
  return newUpdate.raw;
};

const deleteCartItem = async (id: number) => {
  const cartItemRepo = appDataSource.getRepository(CartItem);
  return await cartItemRepo.delete(id);
};
const deleteCartItemByItemId = async (cartId: number, itemId: number) => {
  const cartItemRepo = appDataSource.getRepository(CartItem);
  const deleteOne = await cartItemRepo.findOne({ where: { variantId: itemId, cartId: cartId } });
  if (deleteOne) {
    if (deleteOne?.cartId == cartId) {
      return await deleteCartItem(deleteOne.id);
    }
  } else throw new CustomError(codes.BAD_REQUEST);
};
const getCartId = async (cartItemId: number): Promise<number> => {
  const cartItemRepo = appDataSource.getRepository(CartItem);
  const cartItem = await cartItemRepo.findOne({ where: { id: cartItemId } });
  return cartItem.cartId;
};
const checkExistedItem = async (cartId: number, variantId: number) => {
  return await appDataSource.getRepository(CartItem).findOne({ where: { cartId: cartId, variantId: variantId } });
};

const cartItemDaos = {
  createCartItem,
  getCartItemById,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  checkExistedItem,
  getCartId,
  deleteCartItemByItemId,
};

export default cartItemDaos;
