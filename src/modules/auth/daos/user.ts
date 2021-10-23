import { getRepository } from 'typeorm';
import { User } from '../../../entities/user';
import codes from '../../../errors/codes';
import CustomError from '../../../errors/customError';
import { Register } from '../../../types/type.auth';
import connectionDB from './connectDB';
import { User as UserType } from '../../../entities/user';

const createUser = async (dataRegister: Register) => {
  return await connectionDB
    .then(async (connection) => {
      const { name, email, password } = dataRegister;
      const user = new User();
      user.name = name;
      user.email = email;
      user.password = password;
      return connection.manager.save(user);
    })
    .catch((e) => {
      console.log('err user: ', e);
      throw new CustomError(codes.DUPLICATE, e.message);
    });
};

const findUser = async (dataFind: { email?: string; id?: number }) => {
  const userReposity = getRepository(User);
  let user: UserType;
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
  }
  return user;
};

export default { createUser, findUser };
