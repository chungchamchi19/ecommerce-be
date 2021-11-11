import { Pagination } from "../../types/type.pagination";
import { CartItem } from "../../entities/cartItem";
// import { convertToSlug } from "../../utils/convertToSlug";
import cartItemDaos from "./daos";
import configs from "../../configs";
import mediaServices from "../media/services";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { Media } from "../../entities/media";

const createCartItem = async (cartItemData: CartItem) => {

  const foundItem = await cartItemDaos.checkExistedItem(cartItemData.cartId, cartItemData.variantId);
  // create new cartItem
  if (foundItem) {
    cartItemData.quantity += (await foundItem).quantity 
    return updateCartItem(foundItem.id,cartItemData);
  }
  const newcartItem = await cartItemDaos.createCartItem(cartItemData);
};

const getCartItems = async (params: { pagination: Pagination }): Promise<CartItem[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  let listCartItem = await cartItemDaos.getCartItems({ pagination });
  // listCartItem = listCartItem.map((cartItem: CartItem) => {
  //   return {
  //     ...cartItem,
  //   };
  // });
  return listCartItem;
};

const getCartItemById = async (id: number): Promise<CartItem> => {
  const findCartItem = await cartItemDaos.getCartItemById(id);
  if (!findCartItem) {
    throw new CustomError(codes.NOT_FOUND, "cartItem not found!");
  }
  // const media = formatMedia(findCartItem.featureImage, findcartItem.media);
  // return {
  //   ...findCartItem,
  //   media,
  // };
  return findCartItem;
};

const updateCartItem = async (id: number, data: CartItem): Promise<CartItem> => {
  const findCartItem = await getCartItemById(id);
  if (!findCartItem) {
    throw new CustomError(codes.NOT_FOUND, "cartItem not found!");
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



// const checkExistedItem =  (cartId :number,variantId: number) => {
//   const checkExistedItem = cartItemDaos.checkExistedItem(cartId,variantId);
//   if(checkExistedItem !== -1) {
//     return null;
//   }
//   return checkExistedItem;

// };

const cartItemServices = {
  createCartItem,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  getCartItemById,
};

export default cartItemServices;
