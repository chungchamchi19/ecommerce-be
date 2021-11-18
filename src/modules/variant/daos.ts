import { Variant } from "../../entities/variant";
import { getRepository } from "typeorm";
import { Pagination } from "../../types/type.pagination";

const getVariantById = async (id: number): Promise<Variant> => {
  const variantRepo = getRepository(Variant);
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

const getVariants = async (params: { pagination: Pagination }): Promise<Variant[]> => {
  const variantRepo = getRepository(Variant);
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
  const variantRepo = getRepository(Variant);
  let newVariant = new Variant();
  newVariant = data;
  return await variantRepo.save(newVariant);
};

const updateVariant = async (id: number, data: Variant): Promise<Variant> => {
  const variantRepo = getRepository(Variant);
  await variantRepo.update(id, data);
  return data;
};

const deleteVariant = async (id: number) => {
  const variantRepo = getRepository(Variant);
  await variantRepo.delete(id);
};

const variantDaos = {
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
  getVariants,
};

export default variantDaos;
