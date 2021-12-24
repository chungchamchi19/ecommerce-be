import { getRepository } from "typeorm";
import configs from "../../configs";
import { Contact } from "../../entities/contact";
import { User } from "../../entities/user";
import { Pagination } from "../../types/type.pagination";

const createContact = async (data: Contact) => {
  const contactRepository = getRepository(Contact);
  const contactData = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };
  const contact = contactRepository.create(contactData);
  return await contactRepository.save(contact);
};

const getContactById = async (id: number) => {
  const contactRepository = getRepository(Contact);
  const contact = await contactRepository
    .createQueryBuilder("c")
    .where(`c.id = ${id}`)
    .getOne();
  return contact;
};
const deleteContactById = async (id: number) => {
  const contactRepository = getRepository(Contact);
  const contact = await contactRepository.delete(id);
  return contact;
};


const getAllContacts = async (params: Pagination) => {
  const contactRepository = getRepository(Contact);
  const contacts = await contactRepository
    .createQueryBuilder("c")
    .orderBy("c.createdAt", "DESC")
    .skip(params.offset)
    .take(params.limit || configs.MAX_RECORDS_PER_REQ)
    .getManyAndCount();
  return contacts;
};

export default {
  createContact,
  getContactById,
  getAllContacts,
  deleteContactById,
};
