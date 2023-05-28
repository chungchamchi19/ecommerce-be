import { appDataSource } from "./../../database/connectDB";
import { Variant } from "../../entities/variant";
import { Pagination } from "../../types/type.pagination";

const getVariantById = async (id: number): Promise<Variant> => {
  const variantRepo = appDataSource.getRepository(Variant);
  const variant = await variantRepo
    .createQueryBuilder("v")
    .leftJoinAndSelect("v.featureImage", "fm")
    .leftJoinAndSelect("v.optionValueVariants", "ovv")
    .leftJoinAndSelect("ovv.optionValue", "ov")
    .leftJoinAndSelect("ov.option", "o")
    .where(`v.id=${id}`)
    .getOne();
  return variant;
};
const getVariantWithProductById = async (id: number): Promise<Variant> => {
  const variantRepo = appDataSource.getRepository(Variant);
  const variant = await variantRepo
    .createQueryBuilder("v")
    .leftJoinAndSelect("v.product", "product", "productId=product.id")
    .leftJoinAndSelect("v.featureImage", "fm")
    .leftJoinAndSelect("v.optionValueVariants", "ovv")
    .leftJoinAndSelect("ovv.optionValue", "ov")
    .leftJoinAndSelect("ov.option", "o")

    .where(`v.id=${id}`)
    .getOne();
  return variant;
};

const getVariants = async (params: { pagination: Pagination }): Promise<Variant[]> => {
  const variantRepo = appDataSource.getRepository(Variant);
  const variants = await variantRepo
    .createQueryBuilder("v")
    .leftJoinAndSelect("v.featureImage", "fm")
    .leftJoinAndSelect("v.optionValueVariants", "ovv")
    .leftJoinAndSelect("ovv.optionValue", "ov")
    .leftJoinAndSelect("ov.option", "o")
    .skip(params.pagination.offset)
    .take(params.pagination.limit)
    .orderBy("createdAt", "DESC")
    .getMany();
  return variants;
};

const createVariant = async (data: Variant): Promise<Variant> => {
  const variantRepo = appDataSource.getRepository(Variant);
  let newVariant = variantRepo.create(data);
  return await variantRepo.save(newVariant);
};

const updateVariant = async (id: number, data: Variant): Promise<Variant> => {
  const variantRepo = appDataSource.getRepository(Variant);
  await variantRepo.update(id, data);
  return data;
};

const deleteVariant = async (id: number) => {
  const variantRepo = appDataSource.getRepository(Variant);
  await variantRepo.delete(id);
};

const deleteVariantByIds = async (ids: number[]) => {
  const variantRepo = appDataSource.getRepository(Variant);
  await variantRepo.createQueryBuilder().where("id in (:ids)").setParameters({ ids: ids }).delete().execute();
};

const variantDaos = {
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
  getVariants,
  deleteVariantByIds,
  getVariantWithProductById,
};

export default variantDaos;
