import { Product } from "./../../entities/product";
import { Request, Response } from "express";
import productServices from "./services";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";

const createProduct = async (req: Request, res: Response) => {
  const {
    title,
    description,
    status,
    price,
    comparePrice,
    url,
    vendorId,
    featureImageId,
    media,
    availableNumber,
    options,
  } = req.body;
  if (!featureImageId) {
    throw new CustomError(codes.BAD_REQUEST, "Missing field featureImageId!");
  }
  if (!media) {
    throw new CustomError(codes.BAD_REQUEST, "Missing field media!");
  }
  if (options?.length > 3) {
    throw new CustomError(codes.BAD_REQUEST, "Max length of options is 3!");
  }
  let formatMedia =
    media?.map((item: number) => {
      return {
        id: item,
      };
    }) || 0;
  const productData: Product = {
    title,
    description,
    status,
    price,
    comparePrice,
    url,
    vendorId,
    featureImageId,
    media: formatMedia,
    availableNumber: availableNumber || 0,
    options,
  };
  const newProduct = await productServices.createProduct(productData);
  res.status(200).json({
    status: "success",
    result: newProduct,
  });
};

const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productServices.getProductById(Number(id));
  res.status(200).json({
    status: "success",
    result: product,
  });
};

const getProducts = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;
  const products = await productServices.getProducts({ pagination: { limit: Number(limit), offset: Number(offset) } });
  res.status(200).json({
    status: "success",
    result: products,
  });
};

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  if (data.media && data.media.length) {
    data.media = data.media.map((item: number) => {
      return {
        id: item,
      };
    });
  }
  const product = await productServices.updateProduct(Number(id), data);
  res.status(200).json({
    status: "success",
    result: product,
  });
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productServices.deleteProduct(Number(id));
  res.status(200).json({
    status: "success",
    result: product,
  });
};

const productControllers = {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
};

export default productControllers;
