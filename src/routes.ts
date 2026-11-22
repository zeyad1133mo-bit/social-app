import { Router } from "express";
import { authRouter } from "./app/authentication/routes/authentication.router";
import { userRouter } from "./app/user/routes/user.router";
import { postRouter } from "./app/post/routes/post.router";
import { commentRouter } from "./app/comment/routes/comment.router";

export const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);
