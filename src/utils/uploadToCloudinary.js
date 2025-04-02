// src/utils/uploadToCloudinary.js

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config();

export const uploadToCloudinary = (fileBuffer, folder = "contacts-photos") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (result) resolve(result);
            else reject(error);
        });
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};
