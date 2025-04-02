// src/middlewares/swaggerDocs.js

import createHttpError from "http-errors";
import swaggerUI from "swagger-ui-express";
import fs from "node:fs";

import { SWAGGER_PATH } from "../constants/index.js";

export const swaggerDocs = () => {
    try {
        const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH, "utf-8"));
        return [swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
    } catch (error) {
        console.error("Error loading Swagger docs:", error.message);
        return (req, res, next) =>
            next(createHttpError(500, "Unable to load Swagger documentation."));
    }
};
