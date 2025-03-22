//src\validation\auth.js

import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .trim() // Видаляє зайві пробіли
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Вимикає перевірку TLD для більшої гнучкості
    .required(),
  password: Joi.string()
    .min(6) // Додає мінімальну довжину для пароля
    .max(50) // Встановлює максимальну довжину для безпеки
    .required(),
});
