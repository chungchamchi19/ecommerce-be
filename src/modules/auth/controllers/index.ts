import authService from "../services/auth";
import { Request, Response } from "express";
import { User } from "../../../entities/user";

const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const user: User = (await authService.register({ email, password, name })) as User;
  delete user.password;
  delete user.role;
  return res.status(200).json({
    status: "success",
    result: user,
  });
};

const createUserByDevice = async (req: Request, res: Response) => {
  const { deviceId } = req.body;
  const user: User = (await authService.createUserByDeviceId({ deviceId })) as User;
  delete user.password;
  delete user.role;
  return res.status(200).json({
    status: "success",
    result: user,
  });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: User = (await authService.login({ email, password })) as User;
  delete user.password;
  delete user.role;
  return res.status(200).json({
    status: "success",
    result: user,
  });
};

const me = async (req: Request, res: Response) => {
  const user = req.user;
  delete user.password;
  delete user.role;
  return res.status(200).json({
    status: "success",
    result: user,
  });
};

export default { register, login, me, createUserByDevice };
