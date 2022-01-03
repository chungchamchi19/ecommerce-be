import { Login, Register } from "../../../types/type.auth";
import userDao from "../daos/user";
import { compareBcrypt, generateAccessToken, generateSalt, hashBcrypt } from "./helper";
import CustomError from "../../../errors/customError";
import codes from "../../../errors/codes";
import { User } from "../../../entities/user";
import crypto from "crypto";

const register = async (dataRegister: Register) => {
  const { email, name, password, phone, avatar } = dataRegister;
  const findUserByEmail = await userDao.findUser({ email: email });
  if (findUserByEmail) {
    throw new CustomError(codes.NOT_FOUND, "Your email has been registed!");
  }
  const findUserByName = await userDao.findUser({ name: name });
  if (findUserByName) {
    throw new CustomError(codes.NOT_FOUND, "Your name has been registed!");
  }
  const salt = generateSalt(10);
  const hashPassword = (await hashBcrypt(password, salt)) as string;
  const user = await userDao.createUser({ email, password: hashPassword, name, phone, avatar });
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

const updatePassword = async (user: User, confirmPw: string, newPw: string) => {
  const isCorrectPassword = await compareBcrypt(confirmPw, user.password);
  if (!isCorrectPassword) {
    throw new CustomError(codes.NOT_FOUND, "Wrong password!");
  }
  const salt = generateSalt(10);
  const hashPassword = (await hashBcrypt(newPw, salt)) as string;
  await userDao.updateUser(user.id, { password: hashPassword });
};

const updateUserInfo = async (user: User, data: User): Promise<User> => {
  delete data.id;
  delete data.email;
  delete data.password;
  await userDao.updateUser(user.id, data);
  return {
    ...user,
    ...data,
  };
};

export default { register, login, createUserByDeviceId, updateUserInfo, updatePassword };
