// src\utils\sendMail.js

import nodemailer from "nodemailer";
import { SMTP } from "../constants/index.js";
import { getEnvVar } from "../utils/getEnvVar.js";

const transporter = nodemailer.createTransport({
    host: getEnvVar(SMTP.SMTP_HOST),
    port: Number(getEnvVar(SMTP.SMTP_PORT)),
    secure: false,
    auth: {
        user: getEnvVar(SMTP.SMTP_USER),
        pass: getEnvVar(SMTP.SMTP_PASSWORD)
    }
});

export const sendEmail = async options => {
    const mailOptions = {
        from: getEnvVar(SMTP.SMTP_FROM),
        ...options
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
