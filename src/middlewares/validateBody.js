// src/middlewares/validateBody.js
import createHttpError from 'http-errors';

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const formattedErrors = error.details.map((detail) => detail.message);
    return next(
      createHttpError(400, {
        status: 400,
        message: 'Validation Error',
        details: formattedErrors,
      }),
    );
  }

  next();
};
