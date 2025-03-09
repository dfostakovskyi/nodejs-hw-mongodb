//src\routers\contacts.js

import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  postContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));
contactsRouter.post('/', ctrlWrapper(postContactController));
contactsRouter.patch('/:contactId', ctrlWrapper(patchContactController));
contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactController));

export { contactsRouter };
