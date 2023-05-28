import { appDataSource } from "./../../database/connectDB";
import { Option } from "../../entities/option";

const createOption = async (data: Option): Promise<Option> => {
  const optionRepo = appDataSource.getRepository(Option);
  const newOption = optionRepo.create(data);
  const option = await optionRepo.save(newOption);
  return option;
};

const updateOption = async (id: number, data: Option): Promise<Option> => {
  const optionRepo = appDataSource.getRepository(Option);
  await optionRepo.update(id, data);
  return data;
};

const getOptionById = async (id: number): Promise<Option> => {
  const optionRepo = appDataSource.getRepository(Option);
  return await optionRepo.findOne({ where: { id } });
};

const deleteOptions = async (ids: number[]) => {
  const optionRepo = appDataSource.getRepository(Option);
  const option = await optionRepo.createQueryBuilder().where("id in (:ids)").setParameters({ ids: ids }).delete().execute();
  return option;
};

const optionDaos = {
  createOption,
  updateOption,
  getOptionById,
  deleteOptions,
};

export default optionDaos;
