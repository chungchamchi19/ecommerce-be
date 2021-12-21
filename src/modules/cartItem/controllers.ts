import { CartItem } from "../../entities/cartItem";
import { Request, Response } from "express";
import cartItemServices from "./services";
import CartDaos from "../cart/daos";

const createCartItem = async (req: Request, res: Response) => {
  const userId  = req.user.id;
  const cart = await CartDaos.getCartByUserId(userId);
  const { variantId, quantity } = req.body;
  const cartData: CartItem = {
    cartId: cart?.id,
    variantId,
    quantity,
  };
  const newCartItem = await cartItemServices.createCartItem(cartData);
  res.status(200).json({
    status: "success",
    result: newCartItem,
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
  res.status(200).json({
    status: "success",
    result: cartItem,
  });
};

const deleteCartItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cartItem = await cartItemServices.deleteCartItem(Number(id));
  res.status(200).json({
    status: "success",
    result: cartItem,
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
