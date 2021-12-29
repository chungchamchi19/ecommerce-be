import { CartItem } from "../../entities/cartItem";
import { getRepository } from "typeorm";
import { Pagination } from "../../types/type.pagination";
import { Cart } from "../../entities/cart";

const createCartItem = async (cartItemData: CartItem): Promise<CartItem> => {
  const cartItemRepo = getRepository(CartItem);
  const newCartItem = cartItemRepo.create(cartItemData);
  const cartItem = await cartItemRepo.save(newCartItem);
  return cartItem;
};

const getCartItemById = async (id: number): Promise<CartItem> => {
  const cartItemRepo = getRepository(CartItem);
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
  const cartItemRepo = getRepository(CartItem);
  return await cartItemRepo
    .createQueryBuilder("ci")
    .leftJoinAndSelect("ci.variant", "variant")
    .leftJoinAndSelect("variant.product", "product", "variant.productId=product.id")
    .skip(params.pagination.offset)
    .take(params.pagination.limit)
    .getMany();
};

const updateCartItem = async (id: number, cartData: CartItem): Promise<CartItem> => {
  const cartItemRepo = getRepository(CartItem);
  const newUpdate = await cartItemRepo.update(id, cartData);
  return newUpdate.raw;
};

const deleteCartItem = async (id: number) => {
  const cartItemRepo = getRepository(CartItem);
  return await cartItemRepo.delete(id);
};
const getCartId = async (cartItemId: number) : Promise<number> => {
  const cartItemRepo = getRepository(CartItem);
  const cartItem = await cartItemRepo.findOne(cartItemId);
  console.log(cartItem);
  return cartItem.cartId;
};
const checkExistedItem = async (cartId: number, variantId: number) => {
  return await getRepository(CartItem).findOne({ cartId: cartId, variantId: variantId });
};

const cartItemDaos = {
  createCartItem,
  getCartItemById,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  checkExistedItem,
  getCartId
};

export default cartItemDaos;
