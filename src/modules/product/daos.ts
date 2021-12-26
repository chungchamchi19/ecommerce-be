import { Product } from "../../entities/product";
import { getRepository } from "typeorm";
import { ProductSearchParams } from "../../types/type.product";

const createProduct = async (productData: Product): Promise<Product> => {
  const productRepo = getRepository(Product);
  const newProduct = productRepo.create(productData);
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
    .leftJoinAndSelect("p.vendor", "vd")
    .leftJoinAndSelect("p.options", "o")
    .leftJoinAndSelect("o.optionValues", "ov")
    .leftJoinAndSelect("p.variants", "v")
    .leftJoinAndSelect("v.featureImage", "v_fm")
    .leftJoinAndSelect("v.optionValueVariants", "ovv")
    .leftJoinAndSelect("ovv.optionValue", "ovv_ov")
    .leftJoinAndSelect("ovv_ov.option", "ovv_ov_o")
    .leftJoinAndSelect("p.productCollections", "pc")
    .leftJoinAndSelect("pc.collection", "c")
    .where(`p.id=:id`)
    .setParameters({ id: id })
    .getOne();
  return product;
};

const getProducts = async (params: ProductSearchParams): Promise<{ products: Product[]; total: number }> => {
  const productRepo = getRepository(Product);
  let productQuery = productRepo
    .createQueryBuilder("p")
    .leftJoinAndSelect("p.mediaMaps", "mm", "mm.targetType='product'")
    .leftJoinAndSelect("mm.media", "m")
    .leftJoinAndSelect("p.featureImage", "fm")
    .leftJoinAndSelect("p.productCollections", "pc")
    .leftJoinAndSelect("pc.collection", "c")
    .leftJoinAndSelect("p.vendor", "vd");
  // .leftJoinAndSelect("p.options", "o")
  // .leftJoinAndSelect("o.optionValues", "ov")
  // .leftJoinAndSelect("p.variants", "v")
  // .leftJoinAndSelect("v.featureImage", "v_fm")
  // .leftJoinAndSelect("v.optionValueVariants", "ovv")
  // .leftJoinAndSelect("ovv.optionValue", "ovv_ov")
  // .leftJoinAndSelect("ovv_ov.option", "ovv_ov_o");
  if (params.collectionId) {
    productQuery = productQuery.andWhere("pc.collectionId=:collectionId", {
      collectionId: params.collectionId,
    });
  }
  if (params.title) {
    productQuery = productQuery.andWhere("p.title like :title", { title: `%${params.title}%` });
  }
  // if (params.vendorId) {
  //   productQuery = productQuery.andWhere("vd.id = :vendorId", { vendorId: params.vendorId });
  // }
  if (params.status) {
    productQuery = productQuery.andWhere("p.status = :status", { status: params.status });
  }
  if (params.bestSelling) {
    productQuery = productQuery.andWhere("p.bestSelling = :bestSelling", { bestSelling: params.bestSelling });
  }
  if (params.maxPrice) {
    productQuery = productQuery.andWhere("p.price < :maxPrice", { maxPrice: params.maxPrice });
  }
  if (params.minPrice) {
    productQuery = productQuery.andWhere("p.price >= :minPrice", { minPrice: params.minPrice });
  }
  if (params.sortPrice) {
    productQuery = productQuery.orderBy("p.price", params.sortPrice);
  } else {
    productQuery = productQuery.orderBy("p.createdAt", params.createdAt ? params.createdAt : "DESC");
  }
  const products = await productQuery.skip(params.pagination.offset).take(params.pagination.limit).getMany();
  const total = await productQuery.getCount();
  return {
    products,
    total,
  };
};

const countProducts = async (params: { url?: string; title?: string }): Promise<number> => {
  const productRepo = getRepository(Product);
  let countQuery = productRepo.createQueryBuilder("p");
  if (params.url) {
    countQuery = countQuery.andWhere(`url="${params.url}"`);
  }
  if (params.title) {
    countQuery = countQuery.andWhere(`title="${params.title}"`);
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
