//src\routers\contacts.js

// import { Router } from 'express';
// import {
//   getContactsController,
//   getContactByIdController,
//   postContactController,
//   patchContactController,
//   deleteContactController,
// } from '../controllers/contacts.js';
// import ctrlWrapper from '../utils/ctrlWrapper.js';
// import { validateBody } from '../middlewares/validateBody.js';
// import { isValidId } from '../middlewares/isValidId.js';
// import { authenticate } from '../middlewares/authenticate.js';
// import {
//   createContactSchema,
//   updateContactSchema,
// } from '../validation/contacts.js';

// const contactsRouter = Router();

// contactsRouter.use(authenticate);

// contactsRouter.get('/', ctrlWrapper(getContactsController));
// contactsRouter.get(
//   '/:contactId',
//   isValidId,
//   ctrlWrapper(getContactByIdController),
// );
// contactsRouter.post(
//   '/',
//   validateBody(createContactSchema),
//   ctrlWrapper(postContactController),
// );
// contactsRouter.patch(
//   '/:contactId',
//   isValidId,
//   validateBody(updateContactSchema),
//   ctrlWrapper(patchContactController),
// );
// contactsRouter.delete(
//   '/:contactId',
//   isValidId,
//   ctrlWrapper(deleteContactController),
// );

// export default contactsRouter;

import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  postContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import upload from '../middlewares/upload.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

// Для створення контакту: обробка multipart/form-data за допомогою multer
contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(postContactController),
);

// Для оновлення контакту: обробка файлу та інших даних одночасно
contactsRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
