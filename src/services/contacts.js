//src\services\contacts.js

import { ContactsCollection } from '../db/models/contact.js';

export const getContacts = async (
  userId,
  page,
  perPage,
  sortField,
  sortOrder,
  filters,
) => {
  const skip = (page - 1) * perPage;
  const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  const filterConditions = { userId };
  if (filters.contactType) {
    filterConditions.contactType = filters.contactType;
  }
  if (typeof filters.isFavourite !== 'undefined') {
    filterConditions.isFavourite = filters.isFavourite === 'true';
  }

  const [contacts, count] = await Promise.all([
    ContactsCollection.find(filterConditions)
      .sort(sortOptions)
      .skip(skip)
      .limit(perPage),
    ContactsCollection.countDocuments(filterConditions),
  ]);

  return { contacts, count };
};

export const getContactById = async (userId, id) => {
  const contact = await ContactsCollection.findOne({ _id: id, userId });
  return contact;
};

export const createContact = async (userId, contactData) => {
  const newContact = await ContactsCollection.create({
    ...contactData,
    userId,
  });
  return newContact;
};

export const updateContact = async (userId, id, contactData) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: id, userId },
    contactData,
    { new: true },
  );
  return updatedContact;
};

export const deleteContact = async (userId, id) => {
  const deletedContact = await ContactsCollection.findOneAndDelete({
    _id: id,
    userId,
  });
  return deletedContact;
};
