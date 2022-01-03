import configs from "../../configs";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import { UserMeta } from "./../../entities/userMeta";
import userMetaDaos from "./daos";

const createUserMeta = async (data: UserMeta): Promise<UserMeta> => {
  return await userMetaDaos.createUserMeta(data);
};

const updateUserMeta = async (id: number, data: UserMeta, userId: number): Promise<UserMeta> => {
  const findUserMeta = await userMetaDaos.getUserMetaById(id, userId);
  if (!findUserMeta) {
    throw new CustomError(codes.NOT_FOUND, "User meta not found!");
  }
  delete data.id;
  delete data.userId;
  await userMetaDaos.updateUserMeta(id, data);
  return {
    ...findUserMeta,
    ...data,
  };
};

const deleteUserMeta = async (id: number, userId: number): Promise<UserMeta> => {
  const findUserMeta = await userMetaDaos.getUserMetaById(id, userId);
  if (!findUserMeta) {
    throw new CustomError(codes.NOT_FOUND, "User meta not found!");
  }
  await userMetaDaos.deleteUserMeta(id);
  return findUserMeta;
};

const getUserMetasByKey = async (params: { key: string; userId: number; limit: number; offset: number }): Promise<UserMeta[]> => {
  const limit = params.limit || configs.MAX_RECORDS_PER_REQ;
  const offset = params.offset || 0;
  return await userMetaDaos.getUserMetasByKey({ key: params.key, userId: params.userId, limit, offset });
};

const getUserMetasById = async (id: number, userId: number): Promise<UserMeta> => {
  const userMeta = await userMetaDaos.getUserMetaById(id, userId);
  if (!userMeta) {
    throw new CustomError(codes.NOT_FOUND, "User meta not found!");
  }
  return userMeta;
};

const userMetaServices = {
  createUserMeta,
  updateUserMeta,
  deleteUserMeta,
  getUserMetasByKey,
  getUserMetasById,
};

export default userMetaServices;
