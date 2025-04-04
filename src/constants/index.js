//src\constants\index.js

import path from "node:path";

export const SORT_ORDER = {
    ASC: "asc",
    DESC: "desc"
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const SMTP = {
    SMTP_HOST: "SMTP_HOST",
    SMTP_PORT: "SMTP_PORT",
    SMTP_USER: "SMTP_USER",
    SMTP_PASSWORD: "SMTP_PASSWORD",
    SMTP_FROM: "SMTP_FROM"
};

export const JWT_SECRET = "JWT_SECRET";

export const CLOUDINARY_URL = "CLOUDINARY_URL";

export const SWAGGER_PATH = path.join(process.cwd(), "docs", "swagger.json");

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
