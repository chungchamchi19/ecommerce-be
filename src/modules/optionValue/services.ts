import { OptionValue } from "../../entities/optionValue";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import optionValueDaos from "./daos";

const createOptionValue = async (data: OptionValue): Promise<OptionValue> => {
  const optionValue = await optionValueDaos.createOptionValue(data);
  return optionValue;
};

const updateOptionValue = async (id: number, data: OptionValue): Promise<OptionValue> => {
  const findOptionValue = optionValueDaos.getOptionValueById(id);
  delete data.id;
  if (!findOptionValue) {
    throw new CustomError(codes.NOT_FOUND, "Option value not found!");
  }
  await optionValueDaos.updateOptionValue(id, data);
  return {
    ...findOptionValue,
    ...data,
  };
};

const deleteOptionValues = async (ids: number[]) => {
  if (!ids?.length) {
    throw new CustomError(codes.BAD_REQUEST, "Missing list id to delete!");
  }
  await optionValueDaos.deleteOptionValues(ids);
  return;
};

const optionValueServices = {
  createOptionValue,
  updateOptionValue,
  deleteOptionValues,
};

export default optionValueServices;
