//src\controllers\contacts.js

import createError from 'http-errors';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { field: sortField, order: sortOrder } = parseSortParams(req.query);
  const filters = {
    contactType: req.query.type || null,
    isFavourite: req.query.isFavourite || null,
  };

  const userId = req.user._id;

  const { contacts, count } = await getContacts(
    userId,
    page,
    perPage,
    sortField,
    sortOrder,
    filters,
  );
  const paginationData = calculatePaginationData(count, perPage, page);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: { data: contacts, ...paginationData },
  });
};

export const getContactByIdController = async (req, res) => {
  const userId = req.user._id;
  const contact = await getContactById(userId, req.params.contactId);

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
  const userId = req.user._id;

  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.buffer);
    req.body.photo = uploadResult.secure_url;
  }

  const contact = await createContact(userId, req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const userId = req.user._id;

  if (!req.body || Object.keys(req.body).length === 0) {
    throw createError(400, 'Request body cannot be empty');
  }

  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.buffer);
    req.body.photo = uploadResult.secure_url;
  }

  const updatedContact = await updateContact(
    userId,
    req.params.contactId,
    req.body,
  );

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
  const userId = req.user._id;

  const contact = await deleteContact(userId, req.params.contactId);

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
