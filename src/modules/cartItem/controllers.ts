import { CartItem } from "../../entities/cartItem";
import { Request, Response } from "express";
import cartItemServices from "./services";
import CartDaos from "../cart/daos";
import cartServices from "../cart/services";
import { Cart } from "../../entities/cart";

const createCartItem = async (req: Request, res: Response) => {
  const userId = req.user.id;
  let cart = await CartDaos.getCartByUserId(userId);
  console.log(cart);
  if (!cart) {
    const newCart = new Cart();
    newCart.userId = userId;
    cart = await CartDaos.createCart(newCart);
  }
  const { variantId, quantity } = req.body;
  const cartData: CartItem = {
    cartId: cart?.id,
    variantId,
    quantity,
  };
  const newCartItem = await cartItemServices.createCartItem(cartData);
  const updatedCart = await cartServices.getMyCart(Number(req.user.id));
  res.status(200).json({
    status: "success",
    result: updatedCart,
  });
};

const getCartItemById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cartItem = await cartItemServices.getCartItemById(Number(id));
  res.status(200).json({
    status: "success",
    result: cartItem,
  });
};

const getCartItems = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;
  const cartItems = await cartItemServices.getCartItems({
    pagination: { limit: Number(limit), offset: Number(offset) },
  });
  res.status(200).json({
    status: "success",
    result: cartItems,
  });
};

const updateCartItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const cartItem = await cartItemServices.updateCartItem(Number(id), data);
  const updatedCart = await cartServices.getMyCart(Number(req.user.id));
  res.status(200).json({
    status: "success",
    result: updatedCart,
  });
};

const deleteCartItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cartItem = await cartItemServices.deleteCartItem(Number(id));
  const updatedCart = await cartServices.getMyCart(Number(req.user.id));
  res.status(200).json({
    status: "success",
    result: updatedCart,
  });
};

const cartItemControllers = {
  createCartItem,
  getCartItemById,
  getCartItems,
  updateCartItem,
  deleteCartItem,
};

export default cartItemControllers;
