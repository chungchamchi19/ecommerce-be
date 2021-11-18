import { getRepository } from "typeorm";
import { OptionValue } from "../../entities/optionValue";

const createOptionValue = async (data: OptionValue): Promise<OptionValue> => {
  const optionValueRepo = getRepository(OptionValue);
  let newOptionValue = new OptionValue();
  newOptionValue = data;
  const optionValue = await optionValueRepo.create(newOptionValue);
  return optionValue;
};

const updateOptionValue = async (id: number, data: OptionValue): Promise<OptionValue> => {
  const optionValueRepo = getRepository(OptionValue);
  await optionValueRepo.update(id, data);
  return data;
};

const getOptionValueById = async (id: number): Promise<OptionValue> => {
  const optionValueRepo = getRepository(OptionValue);
  const optionValue = await optionValueRepo.findOne(id);
  return optionValue;
};

const deleteOptionValues = async (ids: number[]) => {
  const optionValueRepo = getRepository(OptionValue);
  const optionValue = await optionValueRepo
    .createQueryBuilder("ov")
    .where(`ov.id in :ids`)
    .setParameters({ ids: `(${ids.join(",")})` })
    .delete();
  return optionValue;
};

const optionValueDaos = {
  createOptionValue,
  updateOptionValue,
  getOptionValueById,
  deleteOptionValues,
};

export default optionValueDaos;
