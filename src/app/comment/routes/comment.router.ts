import { Router } from 'express';
import commentController from '../controllers/comment.controller';
import { authGuard } from '../../../lib/auth/authGuard';

export const commentRouter = Router();

commentRouter.post('/:postId/comments', authGuard, commentController.createComment);
commentRouter.get('/:postId/comments', authGuard, commentController.getComments);
commentRouter.delete('/:id', authGuard, commentController.deleteComment);
