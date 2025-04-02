//src\routers\auth.js

import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import {
    registerUserSchema,
    loginUserSchema,
    requestResetEmailSchema,
    resetPasswordSchema
} from "../validation/auth.js";
import {
    registerUserController,
    loginUserController,
    refreshSessionController,
    logoutUserController,
    sendResetEmailController,
    resetPwdController
} from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";

const authRouter = Router();

authRouter.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerUserController));

authRouter.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginUserController));

authRouter.post("/refresh", ctrlWrapper(refreshSessionController));

authRouter.post("/logout", ctrlWrapper(logoutUserController));

authRouter.post(
    "/send-reset-email",
    validateBody(requestResetEmailSchema),
    ctrlWrapper(sendResetEmailController)
);

authRouter.post("/reset-pwd", validateBody(resetPasswordSchema), ctrlWrapper(resetPwdController));

export default authRouter;
