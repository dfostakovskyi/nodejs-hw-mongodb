//src\server.js

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js'; // Виправлено імпорт, оскільки контактовий роутер експортується як default
import authRouter from './routers/auth.js'; // Імпортуємо роутер для аутентифікації
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import { cleanExpiredSessions } from './services/auth.js'; // Імпортуємо функцію очищення

const setupServer = (port = 3000) => {
  const app = express();

  app.use(cors());

  app.use(pino());

  app.use(express.json());

  app.use('/contacts', contactsRouter); // Виправлено імпорт і використання

  app.use('/auth', authRouter); // Додаємо роутер для аутентифікації

  app.use(notFoundHandler);

  app.use(errorHandler);

  // Очищення прострочених сесій при старті сервера
  cleanExpiredSessions()
    .then(() => console.log('Expired sessions cleaned up at server start.'))
    .catch((error) =>
      console.error('Error during cleaning expired sessions:', error.message),
    );

  // Періодичне очищення прострочених сесій
  setInterval(async () => {
    try {
      await cleanExpiredSessions();
      console.log('Periodic cleanup of expired sessions completed.');
    } catch (error) {
      console.error('Error during periodic cleanup:', error.message);
    }
  }, 3600000); // Один раз на годину

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return app;
};

export { setupServer };
