import { getRepository } from "typeorm";
import { Option } from "../../entities/option";

const createOption = async (data: Option): Promise<Option> => {
  const optionRepo = getRepository(Option);
  let newOption = new Option();
  newOption = data;
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
  const option = await optionRepo.findOne(id);
  return option;
};

const deleteOptions = async (ids: number[]) => {
  const optionRepo = getRepository(Option);
  const option = await optionRepo
    .createQueryBuilder("o")
    .where(`o.id in :ids`)
    .setParameters({ ids: `(${ids.join(",")})` })
    .delete();
  return option;
};

const optionDaos = {
  createOption,
  updateOption,
  getOptionById,
  deleteOptions,
};

export default optionDaos;
