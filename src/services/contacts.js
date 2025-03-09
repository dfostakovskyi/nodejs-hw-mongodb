//src\services\contacts.js

import { ContactsCollection } from '../db/models/contact.js';
import mongoose from 'mongoose';

export const getContacts = async () => {
  console.log('Fetching contacts...');
  const contacts = await ContactsCollection.find();
  console.log('Contacts fetched:', contacts);
  return contacts;
};

export const getContactById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('Invalid ObjectId:', id);
    return null;
  }
  console.log('Fetching contact with id:', id);
  const contact = await ContactsCollection.findById(id);
  console.log('Contact fetched:', contact);
  return contact;
};

export const createContact = async (contactData) => {
  console.log('Creating contact:', contactData);
  const newContact = await ContactsCollection.create(contactData);
  console.log('Contact created:', newContact);
  return newContact;
};

export const updateContact = async (id, contactData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('Invalid ObjectId:', id);
    return null;
  }
  console.log('Updating contact with id:', id);
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    id,
    contactData,
    {
      new: true,
    },
  );
  console.log('Contact updated:', updatedContact);
  return updatedContact;
};

export const deleteContact = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('Invalid ObjectId:', id);
    return null;
  }
  console.log('Deleting contact with id:', id);
  const deletedContact = await ContactsCollection.findByIdAndDelete(id);
  console.log('Contact deleted:', deletedContact);
  return deletedContact;
};
