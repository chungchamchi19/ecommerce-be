import { Request, Response } from "express";
import { UserMeta } from "../../entities/userMeta";
import userMetaServices from "./services";

const create = async (req: Request, res: Response) => {
  const { key, value } = req.body;
  const user = req.user;
  const userMeta: UserMeta = {
    key: key,
    value: value,
    userId: user.id,
  };
  const newUserMeta = await userMetaServices.createUserMeta(userMeta);
  res.status(200).json({
    status: "success",
    result: newUserMeta,
  });
};

const update = async (req: Request, res: Response) => {
  const { key, value } = req.body;
  const id = req.params.id;
  const userId = req.user.id;
  const data: UserMeta = {
    key,
    value,
  };
  const newUserMeta = await userMetaServices.updateUserMeta(Number(id), data, userId);
  res.status(200).json({
    status: "success",
    result: newUserMeta,
  });
};

const deleteById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user.id;
  const deletedUserMeta = await userMetaServices.deleteUserMeta(Number(id), userId);
  res.status(200).json({
    status: "success",
    result: deletedUserMeta,
  });
};

const getById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user.id;
  const userMeta = await userMetaServices.getUserMetasById(Number(id), userId);
  res.status(200).json({
    status: "success",
    result: userMeta,
  });
};

const getByKey = async (req: Request, res: Response) => {
  const { key, limit, offset } = req.query;
  const user = req.user;
  const userMetas = await userMetaServices.getUserMetasByKey({ key: String(key), limit: Number(limit), offset: Number(offset), userId: user.id });
  res.status(200).json({
    status: "success",
    result: userMetas,
  });
};

const userMetaControllers = {
  create,
  update,
  deleteById,
  getById,
  getByKey,
};

export default userMetaControllers;
