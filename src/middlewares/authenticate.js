// src/middlewares/authenticate.js

import createHttpError from "http-errors";

import { Session } from "../db/models/session.js";
import { User } from "../db/models/user.js";

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.get("Authorization");

        if (!authHeader) {
            throw createHttpError(401, "Please provide Authorization header");
        }

        const [bearer, token] = authHeader.split(" ");

        if (bearer !== "Bearer" || !token) {
            throw createHttpError(401, "Auth header should be of type Bearer");
        }

        const session = await Session.findOne({ accessToken: token });

        if (!session) {
            throw createHttpError(401, "Session not found or token invalid");
        }

        const isAccessTokenExpired = new Date() > new Date(session.accessTokenValidUntil);

        if (isAccessTokenExpired) {
            await Session.deleteOne({ accessToken: token });
            throw createHttpError(401, "Access token expired");
        }

        const user = await User.findById(session.userId);

        if (!user) {
            throw createHttpError(401, "User not found");
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};
