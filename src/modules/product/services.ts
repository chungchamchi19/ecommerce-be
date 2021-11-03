import { Pagination } from "./../../types/type.pagination";
import { Product } from "./../../entities/product";
import { convertToSlug } from "../../utils/convertToSlug";
import productDaos from "./daos";
import configs from "../../configs";
import mediaServices from "../media/services";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";

const createProduct = async (product: Product) => {
  const productData: Product = product;
  if (!productData.url) {
    const countProductByUrl: number = await productDaos.countProducts({ title: productData.title });
    if (countProductByUrl) {
      productData.url = convertToSlug(productData.title + " " + countProductByUrl);
    } else {
      productData.url = convertToSlug(productData.title);
    }
  }
  const newProduct = await productDaos.createProduct(productData);
  await mediaServices.updateMedia(product.featureImageId, {
    targetId: newProduct.id,
    targetType: "product",
  });

  return newProduct;
};

const getProducts = async (params: { pagination: Pagination }): Promise<Product[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  return await productDaos.getProducts({ pagination });
};

const getProductById = async (id: number): Promise<Product> => {
  const findProduct = await productDaos.getProductById(id);
  if (!findProduct) {
    throw new CustomError(codes.NOT_FOUND, "Product not found!");
  }
  return findProduct;
};

const updateProduct = async (id: number, data: Product): Promise<Product> => {
  const findProduct = await getProductById(id);
  delete data.id;
  if (data.featureImageId) {
    mediaServices.updateMedia(data.featureImageId, {
      targetType: "product",
      targetId: findProduct.id,
    });
  }
  await productDaos.updateProduct(id, data);
  return {
    ...findProduct,
    ...data,
  };
};

const deleteProduct = async (id: number) => {
  const findProduct = await getProductById(id);
  productDaos.deleteProduct(id);
  return findProduct;
};

const productServices = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
};

export default productServices;
