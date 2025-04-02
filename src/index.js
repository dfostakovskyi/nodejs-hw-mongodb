//src\index.js

import dotenv from "dotenv";
dotenv.config();

import { initMongoConnection } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";

const bootstrap = async () => {
    await initMongoConnection();
    setupServer(3000);
};

bootstrap();
