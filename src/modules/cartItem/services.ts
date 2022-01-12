import { Pagination } from "../../types/type.pagination";
import { CartItem } from "../../entities/cartItem";
// import { convertToSlug } from "../../utils/convertToSlug";
import cartItemDaos from "./daos";
import configs from "../../configs";
import mediaServices from "../media/services";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { Media } from "../../entities/media";
import cartServices from "../cart/services";

const createCartItem = async (cartItemData: CartItem) => {
  const foundItem = await cartItemDaos.checkExistedItem(cartItemData.cartId, cartItemData.variantId);
  // create new cartItem
  if (foundItem) {
    cartItemData.quantity += (await foundItem).quantity;
    return updateCartItem(foundItem.id, cartItemData);
  }
  const newcartItem = await cartItemDaos.createCartItem(cartItemData);
};

const getCartItems = async (params: { pagination: Pagination }): Promise<CartItem[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  let listCartItem = await cartItemDaos.getCartItems({ pagination });
  return listCartItem;
};

const getCartItemById = async (id: number): Promise<CartItem> => {
  const findCartItem = await cartItemDaos.getCartItemById(id);
  if (!findCartItem) {
    throw new CustomError(codes.NOT_FOUND, "cartItem not found!");
  }
  return findCartItem;
};

const updateCartItem = async (id: number, data: CartItem): Promise<CartItem> => {
  const findCartItem = await getCartItemById(id);
  if (!findCartItem) {
    throw new CustomError(codes.NOT_FOUND, "cartItem not found!");
  }
  if (data.quantity == 0) {
    return await deleteCartItem(id);
  }
  delete data.id;
  await cartItemDaos.updateCartItem(id, data);
  return await getCartItemById(id);
};

const deleteCartItem = async (id: number) => {
  const findCartItem = await getCartItemById(id);
  if (!findCartItem) {
    throw new CustomError(codes.NOT_FOUND, "cartItem not found!");
  }

  cartItemDaos.deleteCartItem(id);
  return findCartItem;
};

const deleteCartItemByItemId = async (userId: number, itemId: number) => {
  const cart = await cartServices.getCartByUserId(userId);

  const cartId = cart.id;
  await cartItemDaos.deleteCartItemByItemId(cartId, itemId);
  return;
};
const cartItemServices = {
  createCartItem,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  getCartItemById,
  deleteCartItemByItemId,
};

export default cartItemServices;
