//src\validation\contacts.js

import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        "string.empty": "Name is required.",
        "string.min": "Name must be at least 3 characters long.",
        "string.max": "Name cannot exceed 20 characters."
    }),
    phoneNumber: Joi.string()
        .min(3)
        .max(20)
        .pattern(/^[0-9+()-]+$/)
        .required()
        .messages({
            "string.pattern.base": "Phone number contains invalid characters."
        }),
    email: Joi.string().email().optional(),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string().valid("work", "home", "personal").default("personal")
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).optional(),
    phoneNumber: Joi.string()
        .min(3)
        .max(20)
        .pattern(/^[0-9+()-]+$/)
        .optional(),
    email: Joi.string().email().optional(),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string().valid("work", "home", "personal").optional()
}).min(1);
