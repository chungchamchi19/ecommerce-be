import { Request, Response } from "express";
import configs from "../../configs";
import ROLES from "../../constants/roles";
import { Contact } from "../../entities/contact";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import contactService from "./services";

const createContact = async (req: Request, res: Response) => {
  const { customerName, customerEmail, customerPhone, message } = req.body;
  // const currentUserId = req.user.id;
  const newContact = new Contact();
  newContact.customerName = customerName;
  newContact.customerEmail = customerEmail;
  newContact.customerPhone = customerPhone;
  newContact.message = message;
  const contact = await contactService.createContact(newContact);
  res.status(200).json({
    status: "success",
    result: contact,
  });
};

const getContactById = async (req: Request, res: Response) => {
  const id: number = Number(req.params.contactId);
  const currentUserId = req.user;
  if (currentUserId.role !== "admin") {
    throw new CustomError(codes.FORBIDDEN);
  }
  const response = await contactService.getContactById(id);
  res.status(200).json({
    status: "success",
    result: response,
  });
};

const getAllContacts = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;
  const contacts = await contactService.getAllContacts({
    limit: Number(limit) || configs.MAX_RECORDS_PER_REQ,
    offset: Number(offset) || 0,
  });

  return res.status(200).json({
    status: "success",
    result: contacts[0],
    total: contacts[1],
  });
};

const deleteContact = async (req: Request, res: Response) => {
  const id: number = Number(req.params.contactId);

  return await contactService.deleteContactById(id);
};

export default { createContact, getContactById, getAllContacts, deleteContact };
