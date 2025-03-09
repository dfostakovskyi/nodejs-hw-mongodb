//src\services\contacts.js

import { ContactsCollection } from '../db/models/contact.js';
// import mongoose from 'mongoose';

export const getContacts = async () => {
  const contacts = await ContactsCollection.find();

  return contacts;
};

export const getContactById = async (id) => {
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   console.log('Invalid ObjectId:', id);
  //   return null;
  // }

  const contact = await ContactsCollection.findById(id);

  return contact;
};

export const createContact = async (contactData) => {
  const newContact = await ContactsCollection.create(contactData);

  return newContact;
};

export const updateContact = async (id, contactData) => {
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   console.log('Invalid ObjectId:', id);
  //   return null;
  // }

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
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   console.log('Invalid ObjectId:', id);
  //   return null;
  // }

  const deletedContact = await ContactsCollection.findByIdAndDelete(id);

  return deletedContact;
};
