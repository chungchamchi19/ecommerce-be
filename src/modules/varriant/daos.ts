import { Variant } from "./../../entities/variant";
import { getRepository } from "typeorm";
import { Pagination } from "../../types/type.pagination";

// const createvariant = async (variantData: Variant): Promise<Variant> => {
//   const variantRepo = getRepository(Variant);
//   let newvariant = new variant();
//   newvariant = variantData;
//   const variant = await variantRepo.save(newvariant);
//   return variant;
// };

const getVariantById = async (id: number): Promise<Variant> => {
  const variantRepo = getRepository(Variant);
  const variant = await variantRepo
    .createQueryBuilder("v")
    .leftJoinAndSelect("v.featureImage", "fm", "fm.targetType='variant'")
    .where(`v.id=${id}`)
    .getOne();
  return variant;
};

// const getvariants = async (params: { pagination: Pagination; url?: string }): Promise<variant[]> => {
//   const variantRepo = getRepository(variant);
//   const variants = await variantRepo
//     .createQueryBuilder("p")
//     .leftJoinAndSelect("p.media", "m", "m.targetType='variant'")
//     .leftJoinAndSelect("p.featureImage", "fm", "fm.targetType='variant'")
//     .skip(params.pagination.offset)
//     .take(params.pagination.limit)
//     .getMany();
//   return variants;
// };

// const countvariants = async (params: { url?: string; title?: string }): Promise<number> => {
//   const variantRepo = getRepository(variant);
//   let countQuery = variantRepo.createQueryBuilder("p");
//   if (params.url) {
//     countQuery = countQuery.where(`url="${params.url}"`);
//   }
//   if (params.title) {
//     countQuery = countQuery.where(`title="${params.title}"`);
//   }
//   const count = await countQuery.getCount();
//   return count;
// };

// const updatevariant = async (id: number, variantData: variant): Promise<variant> => {
//   const variantRepo = getRepository(variant);
//   await variantRepo.update(id, variantData);
//   return variantData;
// };

// const deletevariant = async (id: number) => {
//   const variantRepo = getRepository(variant);
//   await variantRepo.delete(id);
// };

const variantDaos = {
//   createvariant,
  getVariantById,
//   getvariants,
//   updatevariant,
//   deletevariant,
//   countvariants,
};

export default variantDaos;
