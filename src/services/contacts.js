//src\services\contacts.js

import { ContactsCollection } from '../db/models/contact.js';

export const getContacts = async (
  page,
  perPage,
  sortField,
  sortOrder,
  filters,
) => {
  const skip = (page - 1) * perPage;
  const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  const filterConditions = {};
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

export const getContactById = async (id) => {
  const contact = await ContactsCollection.findById(id);

  return contact;
};

export const createContact = async (contactData) => {
  const newContact = await ContactsCollection.create(contactData);

  return newContact;
};

export const updateContact = async (id, contactData) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    id,
    contactData,
    {
      new: true,
    },
  );

  return updatedContact;
};

export const deleteContact = async (id) => {
  const deletedContact = await ContactsCollection.findByIdAndDelete(id);

  return deletedContact;
};
