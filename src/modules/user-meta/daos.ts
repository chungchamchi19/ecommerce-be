import { UserMeta } from "./../../entities/userMeta";
import { getRepository } from "typeorm";

const createUserMeta = async (data: UserMeta): Promise<UserMeta> => {
  const userMetaRepo = getRepository(UserMeta);
  let newUserMeta = userMetaRepo.create(data);
  return await userMetaRepo.save(newUserMeta);
};

const updateUserMeta = async (id: number, data: UserMeta) => {
  const userMetaRepo = getRepository(UserMeta);
  await userMetaRepo.update(id, data);
};

const deleteUserMeta = async (id: number) => {
  const userMetaRepo = getRepository(UserMeta);
  await userMetaRepo.delete(id);
};

const getUserMetaById = async (id: number, userId: number): Promise<UserMeta> => {
  const userMetaRepo = getRepository(UserMeta);
  return await userMetaRepo.findOne({ id: id, userId: userId });
};

const getUserMetasByKey = async (params: { key: string; limit: number; offset: number; userId: number }): Promise<UserMeta[]> => {
  const userMetaRepo = getRepository(UserMeta);
  const userMetas = await userMetaRepo
    .createQueryBuilder("um")
    .where("um.key = :key and um.userId = :userId", { key: params.key, userId: params.userId })
    .limit(params.limit)
    .offset(params.offset)
    .getMany();
  return userMetas;
};

const userMetaDaos = {
  createUserMeta,
  updateUserMeta,
  getUserMetasByKey,
  deleteUserMeta,
  getUserMetaById,
};

export default userMetaDaos;
