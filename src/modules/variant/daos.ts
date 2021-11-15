import { Variant } from "../../entities/variant";
import { getRepository } from "typeorm";

const getVariantById = async (id: number): Promise<Variant> => {
  const variantRepo = getRepository(Variant);
  const variant = await variantRepo
    .createQueryBuilder("v")
    .leftJoinAndSelect("v.featureImage", "fm", "fm.targetType='variant'")
    .where(`v.id=${id}`)
    .getOne();
  return variant;
};

const variantDaos = {
  getVariantById,
};

export default variantDaos;
