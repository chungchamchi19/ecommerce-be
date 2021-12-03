import { ProductCollection } from "../../entities/productCollection";
import productCollectionDaos from "./daos";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import { Pagination } from "../../types/type.pagination";
import configs from "../../configs";

const createProductCollection = async (productCollection: ProductCollection): Promise<ProductCollection> => {
  return await productCollectionDaos.createProductCollection(productCollection);
};

const getProductCollectionById = async (id: number): Promise<ProductCollection> => {
  return await productCollectionDaos.getProductCollectionById(id);
};

const updateProductCollection = async (
  id: number,
  productCollection: ProductCollection,
): Promise<ProductCollection> => {
  const findProductCollection = await productCollectionDaos.getProductCollectionById(id);
  if (!findProductCollection) {
    throw new CustomError(codes.NOT_FOUND, "ProductCollection not found!");
  }
  delete productCollection.id;
  const newProductCollection = {
    ...findProductCollection,
    ...productCollection,
  };
  await productCollectionDaos.updateProductCollection(id, productCollection);
  return newProductCollection;
};

const deleteProductCollection = async (id: number) => {
  const findProductCollection = await getProductCollectionById(id);
  await productCollectionDaos.deleteProductCollection(id);
  return findProductCollection;
};

const getProductCollections = async (params: { pagination: Pagination }): Promise<ProductCollection[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  return await productCollectionDaos.getProductCollections({ pagination });
};

const productCollectionServices = {
  createProductCollection,
  getProductCollectionById,
  updateProductCollection,
  deleteProductCollection,
  getProductCollections,
};

export default productCollectionServices;
