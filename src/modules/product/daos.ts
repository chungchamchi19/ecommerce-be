import { Product } from "./../../entities/product";
import { getRepository } from "typeorm";
import { Pagination } from "../../types/type.pagination";

const createProduct = async (productData: Product): Promise<Product> => {
  const productRepo = getRepository(Product);
  let newProduct = new Product();
  newProduct = productData;
  const product = await productRepo.save(newProduct);
  return product;
};

const getProductById = async (id: number): Promise<Product> => {
  const productRepo = getRepository(Product);
  const product = await productRepo
    .createQueryBuilder("p")
    .leftJoinAndSelect("p.mediaMaps", "mm", `mm.targetType='product'`)
    .leftJoinAndSelect("mm.media", "m")
    .leftJoinAndSelect("p.featureImage", "fm")
    .leftJoinAndSelect("p.options", "o")
    .leftJoinAndSelect("o.optionValues", "ov")
    .where(`p.id=${id}`)
    .getOne();
  return product;
};

const getProducts = async (params: { pagination: Pagination; url?: string }): Promise<Product[]> => {
  const productRepo = getRepository(Product);
  const products = await productRepo
    .createQueryBuilder("p")
    .leftJoinAndSelect("p.mediaMaps", "mm", "mm.targetType='product'")
    .leftJoinAndSelect("mm.media", "m")
    .leftJoinAndSelect("p.featureImage", "fm")
    .skip(params.pagination.offset)
    .take(params.pagination.limit)
    .orderBy("p.createdAt", "DESC")
    .getMany();
  return products;
};

const countProducts = async (params: { url?: string; title?: string }): Promise<number> => {
  const productRepo = getRepository(Product);
  let countQuery = productRepo.createQueryBuilder("p");
  if (params.url) {
    countQuery = countQuery.where(`url="${params.url}"`);
  }
  if (params.title) {
    countQuery = countQuery.where(`title="${params.title}"`);
  }
  const count = await countQuery.getCount();
  return count;
};

const updateProduct = async (id: number, productData: Product): Promise<Product> => {
  const productRepo = getRepository(Product);
  await productRepo.update(id, productData);
  return productData;
};

const deleteProduct = async (id: number) => {
  const productRepo = getRepository(Product);
  await productRepo.delete(id);
};

const productDaos = {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
  countProducts,
};

export default productDaos;
