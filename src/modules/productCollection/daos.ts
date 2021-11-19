import { ProductCollection } from "../../entities/productCollection";
import { getRepository } from "typeorm";
import { Pagination } from "../../types/type.pagination";

const createProductCollection = async (data: ProductCollection): Promise<ProductCollection> => {
  const productCollectionRepo = getRepository(ProductCollection);
  let newProductCollection = new ProductCollection();
  newProductCollection = data;
  const productCollection = await productCollectionRepo.save(newProductCollection);
  return productCollection;
};

const getProductCollectionById = async (id: number): Promise<ProductCollection> => {
  const productCollectionRepo = getRepository(ProductCollection);
  return await productCollectionRepo.findOne(id);
};

const updateProductCollection = async (id: number, data: ProductCollection): Promise<ProductCollection> => {
  const productCollectionRepo = getRepository(ProductCollection);
  await productCollectionRepo.update(id, data);
  return data;
};

const deleteProductCollection = async (id: number) => {
  const productCollectionRepo = getRepository(ProductCollection);
  await productCollectionRepo.delete(id);
};

const getProductCollections = async (params: { pagination: Pagination }): Promise<ProductCollection[]> => {
  const productCollectionRepo = getRepository(ProductCollection);
  const productCollections = await productCollectionRepo
    .createQueryBuilder("pc")
    .leftJoinAndSelect("pc.product", "p")
    .skip(params.pagination.offset)
    .take(params.pagination.limit)
    .getMany();
  return productCollections;
};

const productCollectionDaos = {
  createProductCollection,
  getProductCollectionById,
  updateProductCollection,
  deleteProductCollection,
  getProductCollections,
};

export default productCollectionDaos;
