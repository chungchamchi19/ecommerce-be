import { getRepository } from "typeorm";
import { OptionValueVariant } from "../../entities/optionValueVariant";

const createOptionValueVariant = async (data: OptionValueVariant): Promise<OptionValueVariant> => {
  const optionValueVariantRepo = getRepository(OptionValueVariant);
  const newOptionValVariant = optionValueVariantRepo.create(data);
  return await optionValueVariantRepo.save(newOptionValVariant);
};

const getOptionValueById = async (id: number): Promise<OptionValueVariant> => {
  const optionValueVariantRepo = getRepository(OptionValueVariant);
  const optionValVar = await optionValueVariantRepo.findOne(id);
  return optionValVar;
};

const getOptionValueVariants = async (data: OptionValueVariant): Promise<OptionValueVariant[]> => {
  const optionValueVariantRepo = getRepository(OptionValueVariant);
  let optionValVarQuery = optionValueVariantRepo.createQueryBuilder("ovv");
  if (data.id) {
    optionValVarQuery = optionValVarQuery.where("ovv.id=:id");
  }
  if (data.optionValueId) {
    optionValVarQuery = optionValVarQuery.where("ovv.optionValueId=:optionValueId");
  }
  if (data.variantId) {
    optionValVarQuery = optionValVarQuery.where("ovv.variantId=:variantId");
  }
  const optionValVars = await optionValVarQuery
    .setParameters({
      id: data.id,
      variantId: data.variantId,
      optionValueId: data.optionValueId,
    })
    .getMany();
  return optionValVars;
};

const updateOptionValueVariant = async (id: number, data: OptionValueVariant): Promise<OptionValueVariant> => {
  const optionValueVariantRepo = getRepository(OptionValueVariant);
  await optionValueVariantRepo.update(id, data);
  return data;
};

const deleteOptionValueVariants = async (data: OptionValueVariant) => {
  const optionValueVariantRepo = getRepository(OptionValueVariant);
  let optionValVarQuery = optionValueVariantRepo.createQueryBuilder();
  if (data.id) {
    optionValVarQuery = optionValVarQuery.where("id=:id");
  }
  if (data.optionValueId) {
    optionValVarQuery = optionValVarQuery.where("optionValueId=:optionValueId");
  }
  if (data.variantId) {
    optionValVarQuery = optionValVarQuery.where("variantId=:variantId");
  }
  await optionValVarQuery
    .setParameters({
      id: data.id,
      variantId: data.variantId,
      optionValueId: data.optionValueId,
    })
    .delete()
    .execute();
};

const optionValueVariantDaos = {
  createOptionValueVariant,
  updateOptionValueVariant,
  getOptionValueById,
  deleteOptionValueVariants,
  getOptionValueVariants,
};

export default optionValueVariantDaos;
