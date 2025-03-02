//src\server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { getContacts, getContactById } from './services/contacts.js';

const setupServer = () => {
  const app = express();

  // Setup CORS
  app.use(cors());

  // Setup pino logger
  app.use(pino());

  // Setup routes
  app.get('/contacts', async (req, res) => {
    const contacts = await getContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const contact = await getContactById(req.params.contactId);
    if (contact) {
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${req.params.contactId}!`,
        data: contact,
      });
    } else {
      res.status(404).json({
        message: 'Contact not found',
      });
    }
  });

  // Handle non-existing routes
  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Route not found',
    });
  });

  // Get the port from environment variables or default to 3000
  const PORT = process.env.PORT || 3000;

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};

export { setupServer };
