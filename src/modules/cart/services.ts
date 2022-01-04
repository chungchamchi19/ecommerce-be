import { Pagination } from "../../types/type.pagination";
import { Cart } from "../../entities/cart";
// import { convertToSlug } from "../../utils/convertToSlug";
import cartDaos from "./daos";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import shopInforService from "../shopInfor/services";
import variantHelpers from "../variant/helpers";
import variantServices from "../variant/services";
import { Variant } from "../../entities/variant";

const createCart = async (cartData: Cart) => {
  const checkExist = await checkCart(cartData.userId);
  if (checkExist) return checkCart;
  const newcart = await cartDaos.createCart(cartData);
  return newcart;
};

const returnCart = async (cart: any) => {
  let totalPrice = 0;
  let totalComparePrice = 0;
  let totalCountItems = 0;
  for (let i = 0; i < cart?.cartItems?.length; i++) {
    cart.cartItems[i].linePrice = cart.cartItems[i].variant.price * cart.cartItems[i].quantity;
    cart.cartItems[i].lineComparePrice = cart.cartItems[i].variant.comparePrice * cart.cartItems[i].quantity;
    totalPrice += cart.cartItems[i].linePrice;
    totalComparePrice += cart.cartItems[i].lineComparePrice;
    totalCountItems += cart.cartItems[i].quantity;
  }
  for (let i = 0; i < cart?.cartItems?.length; i++) {
    const newVariant = await getVariantPublicTitle(cart.cartItems[i].variant.id);
    cart.cartItems[i].variant["publicTitle"] = newVariant.publicTitle;
  }
  cart["totalPrice"] = totalPrice;
  cart["totalComparePrice"] = totalComparePrice;
  cart["totalCountItems"] = totalCountItems;
  console.log(cart);
  return cart;
};
const getVariantPublicTitle = async (variantId: number): Promise<Variant> => {
  const variant = await variantServices.getVariantById(variantId);
  return variant;
};

const returnCartWithTotalFee = async (cart: any) => {
  let totalPrice = 0;
  let totalComparePrice = 0;
  let totalCountItems = 0;
  for (let i = 0; i < cart?.cartItems?.length; i++) {
    cart.cartItems[i].linePrice = cart.cartItems[i].variant.price * cart.cartItems[i].quantity;
    cart.cartItems[i].lineComparePrice = cart.cartItems[i].variant.comparePrice * cart.cartItems[i].quantity;
    totalPrice += cart.cartItems[i].linePrice;
    totalComparePrice += cart.cartItems[i].lineComparePrice;
    totalCountItems += cart.cartItems[i].quantity;
  }
  for (let i = 0; i < cart?.cartItems?.length; i++) {
    const newVariant = await getVariantPublicTitle(cart.cartItems[i].variant.id);
    cart.cartItems[i].variant["publicTitle"] = newVariant.publicTitle;
  }
  cart["totalPrice"] = totalPrice;
  cart["totalComparePrice"] = totalComparePrice;
  cart["totalCountItems"] = totalCountItems;
  const shopInfor = await shopInforService.getShopInfor();
  cart["shipFee"] = shopInfor.shipFee;
  cart["finalPrice"] = totalPrice + shopInfor.shipFee;
  return cart;
};

const getCartById = async (id: number): Promise<Cart> => {
  const findCart = await cartDaos.getCartById(id);
  if (!findCart) {
    throw new CustomError(codes.NOT_FOUND, "cart not found!");
  }

  return findCart;
};

const getCartByUserId = async (userId: number): Promise<Cart> => {
  const findCart = await cartDaos.getCartByUserId(userId);
  if (!findCart) {
    throw new CustomError(codes.NOT_FOUND, "cart not found!");
  }
  return findCart;
};

const getMyCart = async (userId: number): Promise<Cart> => {
  const findCart = await cartDaos.getMyCart(userId);
  if (!findCart) {
    let newCart = new Cart();
    newCart.userId = userId;
    await cartDaos.createCart(newCart);
    return await cartDaos.getMyCart(userId);
  }
  //  cartServices.returnCart(cart);

  const returnCart = await cartServices.returnCart(findCart);
  return returnCart;
};
const getMyCheckOutCart = async (userId: number): Promise<Cart> => {
  const findCart = await cartDaos.getMyCart(userId);
  if (!findCart) {
    let newCart = new Cart();
    newCart.userId = userId;
    await cartDaos.createCart(newCart);
    return await cartDaos.getMyCart(userId);
  }
  //  cartServices.returnCart(cart);

  const returnCart = await cartServices.returnCartWithTotalFee(findCart);
  return returnCart;
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

const checkCart = (userId: number) => {
  return cartDaos.checkCart(userId);
};
const checkNumberAvailable = async (userId: number): Promise<any[]> => {
  const findCart = await cartDaos.getMyCart(userId);
  let listUnavailable: { variantId: number; productTitle: string; publicTitle: string; message: string }[] = [];
  console.log(findCart);
  for (let i = 0; i < findCart?.cartItems.length; i++) {
    const variant = await variantServices.getVariantWithProductById(findCart?.cartItems[i].variantId);

    if (variant.availableNumber < findCart?.cartItems[i].quantity) {
      console.log(variant);
      console.log(listUnavailable);
      listUnavailable.push({ variantId: variant.id, productTitle: variant.product.title, publicTitle: variant.publicTitle, message: "Không đủ sảng phẩm" });
    }
  }

  return listUnavailable;
};
const cartServices = {
  createCart,
  getCartByUserId,
  updateCart,
  deleteCart,
  getCartById,
  getMyCart,
  returnCart,
  returnCartWithTotalFee,
  getVariantPublicTitle,
  getMyCheckOutCart,
  checkNumberAvailable,
};

export default cartServices;
