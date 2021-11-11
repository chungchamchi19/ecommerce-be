import { Pagination } from "../../types/type.pagination";
import { Cart } from "../../entities/cart";
// import { convertToSlug } from "../../utils/convertToSlug";
import cartDaos from "./daos";
import configs from "../../configs";
import mediaServices from "../media/services";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { Media } from "../../entities/media";

const createCart = async (cartData: Cart) => {
  if (cartData.userId) {
    checkCart(cartData.userId);
  }
  // create new cart
  const newcart = await cartDaos.createCart(cartData);
  
};

// const getCarts = async (params: { pagination: Pagination }): Promise<Cart[]> => {
//   const pagination = {
//     limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
//     offset: params.pagination.offset || 0,
//   };
//   let listCart = await cartDaos.getCarts({ pagination });
//   // listCart = listCart.map((cart: Cart) => {
//   //   return {
//   //     ...cart,
//   //   };
//   // });
//   return listCart;
// };

const getCartById = async (id: number): Promise<Cart> => {
  const findCart = await cartDaos.getCartById(id);
  if (!findCart) {
    throw new CustomError(codes.NOT_FOUND, "cart not found!");
  }
  // const media = formatMedia(findCart.featureImage, findcart.media);
  // return {
  //   ...findCart,
  //   media,
  // };
  return findCart;
};
const getCartByUserId = async (userId: number): Promise<Cart> => {
  const findCart = await cartDaos.getCartByUserId(userId);
  if (!findCart) {
    throw new CustomError(codes.NOT_FOUND, "cart not found!");
  }
  // const media = formatMedia(findCart.featureImage, findcart.media);
  // return {
  //   ...findCart,
  //   media,
  // };
  return findCart;
};


const updateCart = async (id: number, data: Cart): Promise<Cart> => {
  const findCart = await getCartById(id);
  if (!findCart) {
    throw new CustomError(codes.NOT_FOUND, "cart not found!");
  }
  delete data.id;
  await cartDaos.updateCart(id, data);
  return await getCartById(id);
};

const deleteCart = async (id: number) => {
  const findCart = await getCartById(id);
  cartDaos.deleteCart(id);
  return findCart;
};



const checkCart = (userId :number) => {
  // if (!media.find(() => .id === featureImageId)) {
  //   throw new CustomError(codes.BAD_REQUEST, "Feature image id should have in media list!");
  // }
};

const cartServices = {
  createCart,
  // getCarts,
  getCartByUserId,
  updateCart,
  deleteCart,
  getCartById,
};

export default cartServices;
