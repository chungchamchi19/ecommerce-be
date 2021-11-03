import { Product } from "./../../entities/product";
import { Request, Response } from "express";
import productServices from "./services";

const createProduct = async (req: Request, res: Response) => {
  const { title, description, status, price, comparePrice, url, vendorId, featureImageId } = req.body;
  const productData: Product = {
    title,
    description,
    status,
    price,
    comparePrice,
    url,
    vendorId,
    featureImageId,
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
  const data: Product = req.body;
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
