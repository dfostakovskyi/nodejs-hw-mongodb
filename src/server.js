//src\server.js

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { contactsRouter } from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const setupServer = (port = 3000) => {
  const app = express();

  app.use(cors());

  app.use(pino());

  app.use(express.json());

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return app;
};

export { setupServer };
