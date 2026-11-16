import { Router } from "express";
import { authRouter } from "./app/authentication/routes/authentication.router";
import { userRouter } from "./app/user/routes/user.router";

export const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
