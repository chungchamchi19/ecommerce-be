import { Login, Register } from "../../../types/type.auth";
import userDao from "../daos/user";
import { compareBcrypt, generateAccessToken, generateSalt, hashBcrypt } from "./helper";
import CustomError from "../../../errors/customError";
import codes from "../../../errors/codes";
import { User } from "../../../entities/user";
import crypto from "crypto";

const register = async (dataRegister: Register) => {
  const { email, name, password } = dataRegister;
  const salt = generateSalt(10);
  const hashPassword = (await hashBcrypt(password, salt)) as string;
  const user = await userDao.createUser({ email, password: hashPassword, name });
  return user;
};

const login = async (dataLogin: Login) => {
  const { email, password } = dataLogin;
  const user: User = await userDao.findUser({ email });
  if (!user) throw new CustomError(codes.NOT_FOUND, "User not found!");
  const isCorrectPassword = await compareBcrypt(password, user.password);
  if (!isCorrectPassword) throw new CustomError(codes.NOT_FOUND, "Wrong password!");
  const userId = user.id;
  const token = await generateAccessToken(userId);
  return {
    ...user,
    token,
  };
};

const createUserByDeviceId = async (params: { deviceId: string }) => {
  let user: User = await userDao.findUser({ deviceId: params.deviceId });
  if (!user) {
    const randomString = crypto.randomBytes(64).toString("hex");
    user = await userDao.createUser({
      deviceId: params.deviceId,
      name: randomString,
      email: randomString,
      password: "",
    });
  }
  const token = await generateAccessToken(user.id);
  return {
    ...user,
    token,
  };
};

export default { register, login, createUserByDeviceId };
