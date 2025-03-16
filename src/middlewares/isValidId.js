// src/middlewares/isValidId.js

import mongoose from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, `Invalid ID format: ${contactId}`));
  }

  next(); // Якщо ID валідний, переходимо далі
};
