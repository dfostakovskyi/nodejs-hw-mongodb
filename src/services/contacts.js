//src\services\contacts.js

import { ContactsCollection } from '../db/models/contact.js';
import mongoose from 'mongoose';

// Отримання всіх контактів
export const getContacts = async () => {
  console.log('Fetching contacts...');
  const contacts = await ContactsCollection.find();
  console.log('Contacts fetched:', contacts);
  return contacts;
};

// Отримання контакту за ID
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
