import { appDataSource } from "./../../database/connectDB";
import { OptionValue } from "../../entities/optionValue";

const createOptionValue = async (data: OptionValue): Promise<OptionValue> => {
  const optionValueRepo = appDataSource.getRepository(OptionValue);
  let newOptionValue = optionValueRepo.create(data);
  const optionValue = await optionValueRepo.save(newOptionValue);
  return optionValue;
};

const updateOptionValue = async (id: number, data: OptionValue): Promise<OptionValue> => {
  const optionValueRepo = appDataSource.getRepository(OptionValue);
  await optionValueRepo.update(id, data);
  return data;
};

const getOptionValueById = async (id: number): Promise<OptionValue> => {
  const optionValueRepo = appDataSource.getRepository(OptionValue);
  const optionValue = await optionValueRepo.findOne({ where: { id: id } });
  return optionValue;
};

const deleteOptionValues = async (ids: number[]) => {
  const optionValueRepo = appDataSource.getRepository(OptionValue);
  const optionValue = await optionValueRepo.createQueryBuilder().where("id in (:ids)").setParameters({ ids: ids }).delete().execute();
  return optionValue;
};

const optionValueDaos = {
  createOptionValue,
  updateOptionValue,
  getOptionValueById,
  deleteOptionValues,
};

export default optionValueDaos;
