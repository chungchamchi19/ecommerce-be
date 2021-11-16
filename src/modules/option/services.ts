import { Option } from "../../entities/option";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import optionDaos from "./daos";

const createOption = async (option: Option): Promise<Option> => {
  const newOption = await optionDaos.createOption(option);
  return newOption;
};

const updateOption = async (id: number, option: Option): Promise<Option> => {
  const findOption = await optionDaos.getOptionById(id);
  if (!findOption) {
    throw new CustomError(codes.NOT_FOUND, "Option not found!");
  }
  delete option.id;
  const newOption = await optionDaos.updateOption(id, option);
  return newOption;
};

const deleteOptions = async (ids: number[]) => {
  if (!ids?.length) {
    throw new CustomError(codes.BAD_REQUEST, "Missing list id to delete!");
  }
  await optionDaos.deleteOptions(ids);
  return;
};

const optionServices = {
  createOption,
  updateOption,
  deleteOptions,
};

export default optionServices;
