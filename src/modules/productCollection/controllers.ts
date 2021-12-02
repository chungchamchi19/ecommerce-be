import { Request, Response } from "express";
import productCollectionServices from "./services";
import { ProductCollection } from "../../entities/productCollection";

const createProductCollection = async (req: Request, res: Response) => {
  const { productId, collectionId } = req.body;
  const productCollectionData: ProductCollection = { productId, collectionId };
  const newProductCollection = await productCollectionServices.createProductCollection(productCollectionData);
  res.status(200).json({
    status: "success",
    result: newProductCollection,
  });
};

const getProductCollectionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const productCollection = await productCollectionServices.getProductCollectionById(Number(id));
  res.status(200).json({
    status: "success",
    results: productCollection,
  });
};

const getProductCollections = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;
  const productCollections = await productCollectionServices.getProductCollections({
    pagination: { limit: Number(limit), offset: Number(offset) },
  });
  res.status(200).json({
    status: "success",
    result: productCollections,
  });
};

const updateProductCollection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const productCollections = await productCollectionServices.updateProductCollection(Number(id), data);
  res.status(200).json({
    status: "success",
    result: productCollections,
  });
};

const deleteProductCollection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const productCollections = await productCollectionServices.deleteProductCollection(Number(id));
  res.status(200).json({
    status: "success",
    result: productCollections,
  });
};

const productCollectionControllers = {
  createProductCollection,
  getProductCollectionById,
  getProductCollections,
  deleteProductCollection,
  updateProductCollection,
};

export default productCollectionControllers;
