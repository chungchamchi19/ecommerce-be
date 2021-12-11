import { Contact } from "../../entities/contact";
import { Pagination } from "../../types/type.pagination";
import { sendEmail } from "../../utils/sendEmail";
import contactDao from "./daos";

const createContact = async (contact: Contact ) => {
  const newContact = await contactDao.createContact(contact);
  await sendEmail(contact);
  return newContact;
};



const getContactById = async (id: number) => {
  return await contactDao.getContactById(id);

};


const deleteContactById = async (id: number) => {
  return await contactDao.deleteContactById(id);

};



const getAllContacts = async (params: Pagination) => {
  return await contactDao.getAllContacts(params);
};

export default { createContact,getContactById,getAllContacts ,deleteContactById};
