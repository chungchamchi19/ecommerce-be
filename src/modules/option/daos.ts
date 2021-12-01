import { getRepository } from "typeorm";
import { Option } from "../../entities/option";

const createOption = async (data: Option): Promise<Option> => {
  const optionRepo = getRepository(Option);
  const newOption = optionRepo.create(data);
  const option = await optionRepo.save(newOption);
  return option;
};

const updateOption = async (id: number, data: Option): Promise<Option> => {
  const optionRepo = getRepository(Option);
  await optionRepo.update(id, data);
  return data;
};

const getOptionById = async (id: number): Promise<Option> => {
  const optionRepo = getRepository(Option);
  return await optionRepo.findOne(id);
};

const deleteOptions = async (ids: number[]) => {
  const optionRepo = getRepository(Option);
  const option = await optionRepo
    .createQueryBuilder()
    .where(`id in :ids`)
    .setParameters({ ids: `(${ids.join(",")})` })
    .delete()
    .execute();
  return option;
};

const optionDaos = {
  createOption,
  updateOption,
  getOptionById,
  deleteOptions,
};

export default optionDaos;
