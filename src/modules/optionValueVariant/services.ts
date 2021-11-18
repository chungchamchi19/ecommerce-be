import { OptionValueVariant } from "../../entities/optionValueVariant";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import optionValueVariantDaos from "./daos";

const createOptionValueVariant = async (data: OptionValueVariant): Promise<OptionValueVariant> => {
  return await optionValueVariantDaos.createOptionValueVariant(data);
};

const updateOptionValueVariant = async (id: number, data: OptionValueVariant): Promise<OptionValueVariant> => {
  const findOVV = await optionValueVariantDaos.getOptionValueById(id);
  if (!findOVV) {
    throw new CustomError(codes.NOT_FOUND, "Option Value Variant not found!");
  }
  delete data.id;
  await optionValueVariantDaos.updateOptionValueVariant(id, data);
  return {
    ...findOVV,
    ...data,
  };
};

const getOptionvalueVariants = async (data: OptionValueVariant): Promise<OptionValueVariant[]> => {
  const optionValVars = await optionValueVariantDaos.getOptionValueVariants(data);
  return optionValVars;
};

const deleteOptionValueVariants = async (data: OptionValueVariant) => {
  await optionValueVariantDaos.deleteOptionValueVariants(data);
};

const optionValueVariantServices = {
  createOptionValueVariant,
  updateOptionValueVariant,
  getOptionvalueVariants,
  deleteOptionValueVariants,
};

export default optionValueVariantServices;
