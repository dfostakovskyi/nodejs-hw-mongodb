//src\controllers\contacts.js

import createError from 'http-errors';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const contacts = await getContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const contact = await getContactById(req.params.contactId);
  if (contact) {
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.contactId}!`,
      data: contact,
    });
  } else {
    throw createError(404, 'Contact not found');
  }
};

export const postContactController = async (req, res) => {
  const contact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw createError(400, 'Request body cannot be empty');
  }

  const updatedContact = await updateContact(req.params.contactId, req.body);
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const contact = await deleteContact(req.params.contactId);
  if (contact) {
    res.status(204).end();
  } else {
    throw createError(404, 'Contact not found');
  }
};

export default {
  getContactsController,
  getContactByIdController,
  postContactController,
  patchContactController,
  deleteContactController,
};
