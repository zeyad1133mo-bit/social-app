import {Router} from "express";
import authController from "../controllers/authentication.controller";
import { authGuard } from "../../../lib/auth/authGuard";

export const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/verify',  authController.verifyAccount);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.post('/login', authController.login);
authRouter.post('/login/verify-2step',authController.verify2Step);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/google',authController.googleLogin);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.post('/logout', authGuard, authController.logout);