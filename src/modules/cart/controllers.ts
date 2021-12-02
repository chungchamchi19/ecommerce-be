import { Cart } from "../../entities/cart";
import { Request, Response } from "express";
import cartServices from "./services";

const createCart = async (req: Request, res: Response) => {
  const userId  = req.user.id;
  const cartData: Cart = {
    userId
  };
  const newCart = await cartServices.createCart(cartData);
  res.status(200).json({
    status: "success",
    result: newCart,
  });
};

const getCartById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cart = await cartServices.getCartById(Number(id));
  res.status(200).json({
    status: "success",
    result: cart,
  });
};

const getCartByUserId = async (req: Request, res: Response) => {
  const {userId} = req.params;
  
  const carts = await cartServices.getCartByUserId(Number(userId));
  res.status(200).json({
    status: "success",
    result: carts,
  });
};
const getCart = async (req: Request, res: Response) => {
  const carts = await cartServices.getMyCart(Number(req.user?.id));
  res.status(200).json({
    status: "success",
    result: carts,
  });
};


const deleteCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cart = await cartServices.deleteCart(Number(id));
  res.status(200).json({
    status: "success",
    result: cart,
  });
};

const cartControllers = {
  createCart,
  getCartByUserId,  
  getCartById,
  deleteCart,
  getCart,
};

export default cartControllers;
