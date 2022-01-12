import { Cart } from "../../entities/cart";
import { Request, Response } from "express";
import cartServices from "./services";

const createCart = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const cartData: Cart = {
    userId,
  };
  const newCart = await cartServices.createCart(cartData);
  res.status(200).json({
    status: "success",
    result: newCart,
  });
};
// const updateCart = async (req: Request, res: Response) => {
//   const userId = req.user.id;
//   const cartData: Cart = {
//     userId,
//   };
//   const newCart = await cartServices.createCart(cartData);
//   res.status(200).json({
//     status: "success",
//     result: newCart,
//   });
// };

const getCartById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cart = await cartServices.getCartById(Number(id));
  res.status(200).json({
    status: "success",
    result: cart,
  });
};

const getCartByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const carts = await cartServices.getCartByUserId(Number(userId));
  res.status(200).json({
    status: "success",
    result: carts,
  });
};

const getCart = async (req: Request, res: Response) => {
  const returnCart = await cartServices.getMyCart(Number(req.user?.id));
  // const returnCart = await cartServices.returnCart(cart);
  res.status(200).json({
    status: "success",
    result: returnCart,
  });
};

const checkNumberAvailable = async (req: Request, res: Response) => {
  const result= await cartServices.checkNumberAvailable(Number(req.user?.id));
  // const returnCart = await cartServices.returnCart(cart);
  return  res.status(200).json({
    result,
  });
};
const getCheckoutInfor = async (req: Request, res: Response) => {
  // const cart = await cartServices.getMyCart(Number(req.user?.id));
  const returnCart = await cartServices.getMyCheckOutCart(Number(req.user?.id));

  res.status(200).json({
    status: "success",
    result: returnCart,
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
  getCheckoutInfor,
  checkNumberAvailable
};

export default cartControllers;
