// src\routers\index.js

import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const router = Router();

router.use('/contacts', contactsRouter); // Виправлено шлях для контактового роутера
router.use('/auth', authRouter);

export default router;
