import { getRepository } from "typeorm";
import { Register } from "../../../types/type.auth";
import { User } from "../../../entities/user";

const createUser = async (dataRegister: Register) => {
  const userReposity = getRepository(User);
  const { deviceId, name, email, password, avatar, phone } = dataRegister;
  const user = new User();
  user.name = name;
  user.email = email;
  user.password = password;
  user.avatar = avatar;
  user.phone = phone;
  if (deviceId) {
    user.deviceId = deviceId;
    return await userReposity.save(user);
  }
  return await userReposity.save(user);
};

const findUser = async (dataFind: { email?: string; id?: number; deviceId?: string; name?: string }) => {
  const userReposity = getRepository(User);
  let user: User;
  if (dataFind.email) {
    user = await userReposity.findOne({
      where: {
        email: dataFind.email,
      },
    });
  } else if (dataFind.id) {
    user = await userReposity.findOne({
      where: {
        id: dataFind.id,
      },
    });
  } else if (dataFind.deviceId) {
    user = await userReposity.findOne({
      where: {
        deviceId: dataFind.deviceId,
      },
    });
  } else if (dataFind.name) {
    user = await userReposity.findOne({
      where: {
        name: dataFind.name,
      },
    });
  }
  return user;
};

const updateUser = async (id: number, data: User) => {
  const userReposity = getRepository(User);
  await userReposity.update(id, data);
};

export default { createUser, findUser, updateUser };
