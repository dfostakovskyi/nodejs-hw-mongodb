//src\controllers\contacts.js

import createError from 'http-errors';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error('Error in getContactsController:', error);
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (contact) {
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${req.params.contactId}!`,
        data: contact,
      });
    } else {
      console.warn('Contact not found with id:', req.params.contactId);
      next(createError(404, 'Contact not found'));
    }
  } catch (error) {
    console.error('Error in getContactByIdController:', error);
    next(error);
  }
};

export const postContactController = async (req, res, next) => {
  try {
    console.log('Creating new contact:', req.body);
    const contact = await createContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created contact!',
      data: contact,
    });
  } catch (error) {
    console.error('Error in postContactController:', error);
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(createError(400, 'Request body cannot be empty'));
    }

    const updatedContact = await updateContact(req.params.contactId, req.body);

    if (!updatedContact) {
      console.warn('Contact not found for id:', req.params.contactId);
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    console.error('Error in patchContactController:', error);
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const contact = await deleteContact(req.params.contactId);
    if (contact) {
      res.status(204).end();
    } else {
      console.warn('Contact not found with id:', req.params.contactId);
      next(createError(404, 'Contact not found'));
    }
  } catch (error) {
    console.error('Error in deleteContactController:', error);
    next(error);
  }
};

export default {
  getContactsController,
  getContactByIdController,
  postContactController,
  patchContactController,
  deleteContactController,
};
